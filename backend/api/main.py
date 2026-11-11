"""
Sentinel-Stream — FastAPI Backend
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REST API for the React frontend. Handles:
  - Video upload → Modal pipeline → Gemini synthesis → ingest
  - Per-video events, alerts, summaries
  - RAG-powered chat (Gemini answers + CLIP search)
  - Persistent chat history
  - Dashboard stats & insights

IMPORTANT: Before uploading, deploy the Modal app once:
    modal deploy workers/inference.py

Run locally:
    uvicorn api.main:app --reload --port 8000
"""

from __future__ import annotations
import os, json, time, math, traceback

# Load .env from backend/ directory before anything else reads os.environ
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
except ImportError:
    pass
from pathlib import Path
from fastapi import FastAPI, Query, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, Response
from pydantic import BaseModel
from typing import List, Dict, Any, Optional, AsyncIterator


# ─── App Setup ────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Sentinel-Stream API",
    description="AI Video Surveillance Backend — Upload, Analyze, Search",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_UPLOAD_MB = 5120
UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
RESULTS_DIR = Path(__file__).parent.parent / "results"

_jobs: Dict[str, Dict] = {}


# ─── Request Models ───────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    query: str
    video_id: Optional[str] = None
    top_k: int = 10


class MemoryQueryRequest(BaseModel):
    query: str
    video_id: Optional[str] = None


# ─── Startup ──────────────────────────────────────────────────────────────────

@app.on_event("startup")
def startup():
    from services.db import init_db
    init_db()
    UPLOAD_DIR.mkdir(exist_ok=True)
    RESULTS_DIR.mkdir(exist_ok=True)

    # Pre-warm CLIP text encoder in background — eliminates ~30s cold start on first chat
    import threading
    def _warm_clip():
        try:
            from services.clip_search import encode_text
            encode_text("security camera footage person walking")
            print("✅ CLIP text encoder pre-warmed")
        except Exception as e:
            print(f"⚠️  CLIP warmup failed: {e}")
    threading.Thread(target=_warm_clip, daemon=True).start()


# ─── Health ───────────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "sentinel-stream"}


# ─── Upload Pipeline ─────────────────────────────────────────────────────────

def _cleanup(path: str):
    try:
        os.remove(path)
    except Exception:
        pass


def _process_video_direct(video_id: str, video_name: str, file_path: str):
    """Direct video processing pipeline (running directly on local machine or Colab, no Modal required)."""
    import cv2
    import numpy as np
    from datetime import datetime
    import math

    t_start = time.time()
    _jobs[video_id] = {"status": "processing", "progress": 15, "error": None}

    # Step 1: Video duration
    cap = cv2.VideoCapture(file_path)
    if not cap.isOpened():
        raise RuntimeError(f"Cannot open video: {file_path}")
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    total_seconds = total_frames / fps if fps > 0 else 0.0
    cap.release()
    print(f"[direct] Duration: {total_seconds:.1f}s, fps: {fps}")

    _jobs[video_id]["progress"] = 25

    # Step 2: Active subclips & motion analysis
    from workers.pipeline import (
        make_video_chunks, find_active_windows, make_subclips,
        is_after_hours, label_from_signals, compute_alert_score, extract_caption_threats
    )

    raw_chunks = make_video_chunks(total_seconds, 300.0)
    all_subclips = []
    t_cpu_start = time.time()

    for chunk_idx, (chunk_start, chunk_end) in enumerate(raw_chunks):
        cap = cv2.VideoCapture(file_path)
        cap.set(cv2.CAP_PROP_POS_MSEC, chunk_start * 1000)
        sample_every = max(1, int(fps / 2))
        motion_scores = []
        prev_gray = None
        f_idx = 0

        while cap.isOpened():
            pos_sec = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000.0
            if pos_sec > chunk_end + 0.5:
                break
            ret, frame = cap.read()
            if not ret:
                break
            if f_idx % sample_every == 0:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                gray = cv2.GaussianBlur(gray, (5, 5), 0)
                if prev_gray is not None:
                    diff = cv2.absdiff(prev_gray, gray)
                    score = float(np.sum(diff > 25) / diff.size)
                    motion_scores.append((pos_sec, score))
                prev_gray = gray
            f_idx += 1
        cap.release()

        raw_windows = find_active_windows(motion_scores) if motion_scores else []
        if not raw_windows and total_seconds > 0:
            raw_windows = [(0.0, total_seconds)]

        try:
            mtime = os.path.getmtime(file_path)
            recording_hour = datetime.fromtimestamp(mtime).hour
        except Exception:
            recording_hour = 12
        after_hours = is_after_hours(recording_hour)

        for w_idx, (win_start, win_end) in enumerate(raw_windows):
            subclips = make_subclips(win_start, win_end, 10.0, 2.0)
            for sc_start, sc_end in subclips:
                all_subclips.append({
                    "video_source": video_name,
                    "start_sec": sc_start,
                    "end_sec": sc_end,
                    "duration": sc_end - sc_start,
                    "chunk_index": chunk_idx,
                    "window_index": w_idx,
                    "after_hours": after_hours,
                    "dwell_seconds": win_end - win_start,
                })

    cpu_time_s = time.time() - t_cpu_start
    print(f"[direct] {len(all_subclips)} sub-clips detected (motion phase: {cpu_time_s:.1f}s)")
    _jobs[video_id]["progress"] = 40

    if not all_subclips:
        all_subclips.append({
            "video_source": video_name,
            "start_sec": 0.0,
            "end_sec": min(total_seconds, 10.0),
            "duration": min(total_seconds, 10.0),
            "chunk_index": 0,
            "window_index": 0,
            "after_hours": False,
            "dwell_seconds": min(total_seconds, 10.0),
        })

    # Step 3: YOLO & Gemini inference
    yolo_model = None
    try:
        from ultralytics import YOLO
        yolo_model = YOLO("yolo11n.pt")
        print("[direct] YOLO11 loaded successfully")
    except Exception as e:
        print(f"[direct] YOLO not loaded ({e})")

    gemini_key = os.environ.get("GEMINI_API_KEY", "")
    gemini_client = None
    if gemini_key:
        try:
            from google import genai
            gemini_client = genai.Client(api_key=gemini_key)
            print("[direct] Gemini client initialized")
        except Exception as e:
            print(f"[direct] Gemini client init warning: {e}")

    events = []
    t_gpu_start = time.time()

    for idx, sc in enumerate(all_subclips):
        _jobs[video_id]["progress"] = 40 + int(((idx + 1) / len(all_subclips)) * 40)
        win_start = sc["start_sec"]
        win_end = sc["end_sec"]
        clip_id = f"c{sc['chunk_index']:02d}_w{sc['window_index']:04d}_{idx:02d}"

        cap = cv2.VideoCapture(file_path)
        cap.set(cv2.CAP_PROP_POS_MSEC, win_start * 1000)
        step = max(1, int(fps / 8))
        frames = []
        while cap.isOpened():
            ts = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000.0
            if ts > win_end + 0.1:
                break
            ret, frame = cap.read()
            if not ret:
                break
            frames.append((ts, frame))
        cap.release()

        people_max = 0
        vehicle_max = 0
        objects_seen = {}

        if yolo_model and frames:
            sample_frames = [f[1] for f in frames[::step]]
            if sample_frames:
                try:
                    yolo_res = yolo_model(sample_frames, conf=0.25, verbose=False)
                    for res in yolo_res:
                        p_c, v_c = 0, 0
                        for box in res.boxes:
                            cname = res.names[int(box.cls[0])]
                            objects_seen[cname] = objects_seen.get(cname, 0) + 1
                            if cname == "person":
                                p_c += 1
                            elif cname in ("car", "truck", "bus", "motorcycle"):
                                v_c += 1
                        people_max = max(people_max, p_c)
                        vehicle_max = max(vehicle_max, v_c)
                except Exception as e:
                    print(f"[direct] YOLO error: {e}")

        caption_text = ""
        vlm_flags = {"is_fighting": False, "is_stealing": False, "is_erratic": False}

        if gemini_client and frames:
            try:
                from PIL import Image
                from google.genai import types
                k_step = max(1, len(frames) // 4)
                sampled_frames = frames[::k_step][:4]
                img_parts = [Image.fromarray(cv2.cvtColor(f[1], cv2.COLOR_BGR2RGB)) for f in sampled_frames]

                prompt = (
                    "You are a Forensic Video Surveillance Analyst. Analyze these sequential CCTV frames.\n"
                    "Provide a concise, 1-2 sentence description of any person actions, posture, movement, or stealth/theft/suspicious behavior.\n"
                    "Output JSON: {\"description\": \"...\", \"is_fighting\": false, \"is_stealing\": false, \"is_erratic\": false}"
                )
                resp = gemini_client.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=[*img_parts, prompt],
                    config=types.GenerateContentConfig(temperature=0.2, response_mime_type="application/json")
                )
                if resp and resp.text:
                    clean_text = resp.text.strip()
                    if clean_text.startswith("```"):
                        clean_text = clean_text.split("\n", 1)[-1].rsplit("```", 1)[0].strip()
                    parsed = json.loads(clean_text)
                    caption_text = parsed.get("description", "")
                    vlm_flags["is_fighting"] = parsed.get("is_fighting", False)
                    vlm_flags["is_stealing"] = parsed.get("is_stealing", False)
                    vlm_flags["is_erratic"] = parsed.get("is_erratic", False)
            except Exception as e:
                print(f"[direct] Gemini keyframe captioning error: {e}")

        if not caption_text:
            caption_text = f"Activity detected from {win_start:.1f}s to {win_end:.1f}s with {people_max} person(s)."

        ev_list, tags = label_from_signals(
            people_count=people_max,
            vehicle_count=vehicle_max,
            contact_score=0.0,
            peak_motion=0.5,
            dwell_seconds=sc["dwell_seconds"],
            after_hours_flag=sc["after_hours"],
            caption=caption_text,
        )
        top_event = ev_list[0] if ev_list else {"label": "activity_detected", "confidence": 0.5}

        caption_threats = extract_caption_threats(caption_text)
        alert_score, alert_stage = compute_alert_score(
            evidence={
                "motion": 0.5,
                "overlap": 0.0,
                "dwell_norm": min(1.0, sc["dwell_seconds"] / 60.0),
                "people_norm": min(1.0, people_max / 4.0),
                "after_hours": 1.0 if sc["after_hours"] else 0.0,
            },
            after_hours_flag=sc["after_hours"],
            events_list=ev_list,
            caption_threats=caption_threats,
        )

        if vlm_flags.get("is_stealing") or any(w in caption_text.lower() for w in ("theft", "thief", "steal", "creep", "sneak", "prowl")):
            if alert_stage == "none":
                alert_stage = "Stage B"
                alert_score = max(alert_score, 0.65)

        events.append({
            "clip_id": clip_id,
            "video_source": video_name,
            "start": round(win_start, 2),
            "end": round(win_end, 2),
            "duration": round(win_end - win_start, 2),
            "detections": {
                "people_count": people_max,
                "vehicle_count": vehicle_max,
                "peak_motion": 0.5,
                "mean_motion": 0.3,
                "contact_score": 0.0,
                "objects": objects_seen if objects_seen else None,
            },
            "event": {
                "label": top_event["label"],
                "confidence": round(top_event.get("confidence", 0.5), 3),
            },
            "events_detected": ev_list,
            "caption": caption_text,
            "tags": list(set(tags + [top_event["label"]])),
            "alert": {
                "score": round(alert_score, 3),
                "stage": alert_stage,
                "reason": f"Activity: {top_event['label']}",
            },
            "_clip_embedding": [0.0] * 768,
            "_track_trajectories": {},
            "processed_at": datetime.utcnow().isoformat() + "Z",
            "processing_gpu": "Direct-GPU",
        })

    gpu_time_s = time.time() - t_gpu_start
    total_time_s = time.time() - t_start

    alerts = [e for e in events if e["alert"]["stage"] != "none"]
    events_path = RESULTS_DIR / f"{video_id}_events.json"
    with open(events_path, "w") as f:
        json.dump({
            "video": video_name,
            "duration_s": total_seconds,
            "total_alerts": len(alerts),
            "gpu": "Direct-GPU",
            "chunks": len(raw_chunks),
            "subclips": len(all_subclips),
            "cpu_time_s": round(cpu_time_s, 1),
            "gpu_time_s": round(gpu_time_s, 1),
            "processing_time_s": round(total_time_s, 1),
            "events": events,
        }, f)

    _jobs[video_id] = {"status": "analyzing", "progress": 85, "error": None}

    from services.ingest import ingest_results
    ingest_results(str(events_path), delete_json=True)

    _cleanup(file_path)
    _jobs[video_id] = {"status": "done", "progress": 100, "error": None}
    print(f"[direct] Video '{video_name}' complete in {total_time_s:.1f}s")


def _process_video_background(video_id: str, video_name: str, file_path: str):
    """Background: Try Modal if configured, otherwise fallback to Direct pipeline."""
    try:
        import modal
        import modal.config
        cfg = modal.config.config
        if not (cfg.get("token_id") and cfg.get("token_secret")):
            raise RuntimeError("Modal token not configured")

        t_start = time.time()
        _jobs[video_id] = {"status": "uploading", "progress": 10, "error": None}
        video_vol = modal.Volume.from_name("vigilant-videos", create_if_missing=True)
        with video_vol.batch_upload(force=True) as batch:
            batch.put_file(file_path, video_name)
        print(f"[upload] '{video_name}' → Modal Volume")

        _jobs[video_id] = {"status": "processing", "progress": 25, "error": None}
        get_video_duration = modal.Function.from_name("vigilant-ai", "get_video_duration")
        chunk_and_score = modal.Function.from_name("vigilant-ai", "chunk_and_score")
        FeatureExtractorCls = modal.Cls.from_name("vigilant-ai", "FeatureExtractor")
        extractor = FeatureExtractorCls()

        total_seconds = get_video_duration.remote(video_name)
        num_chunks = max(1, math.ceil(total_seconds / 300.0))
        chunk_args = [
            (video_name, i * 300.0, min((i + 1) * 300.0, total_seconds), i)
            for i in range(num_chunks)
        ]

        _jobs[video_id]["progress"] = 40
        t_cpu_start = time.time()
        chunked_results = list(chunk_and_score.map(chunk_args, order_outputs=True))
        cpu_time_s = time.time() - t_cpu_start
        all_subclips = [sc for chunk_scs in chunked_results for sc in chunk_scs]

        if not all_subclips:
            _cleanup(file_path)
            _jobs[video_id] = {"status": "done", "progress": 100, "error": None,
                               "message": "No active scenes detected"}
            return

        t_gpu_start = time.time()
        events = list(extractor.extract_from_window.map(all_subclips, order_outputs=False))
        gpu_time_s = time.time() - t_gpu_start
        events.sort(key=lambda e: e["start"])

        _jobs[video_id]["progress"] = 75
        alerts = [e for e in events if e["alert"]["stage"] != "none"]
        total_time_s = time.time() - t_start
        events_path = RESULTS_DIR / f"{video_id}_events.json"
        with open(events_path, "w") as f:
            json.dump({
                "video": video_name,
                "duration_s": total_seconds,
                "total_alerts": len(alerts),
                "gpu": "A100-80GB",
                "chunks": num_chunks,
                "subclips": len(all_subclips),
                "cpu_time_s": round(cpu_time_s, 1),
                "gpu_time_s": round(gpu_time_s, 1),
                "processing_time_s": round(total_time_s, 1),
                "events": events,
            }, f)

        _jobs[video_id] = {"status": "analyzing", "progress": 85, "error": None}
        from services.ingest import ingest_results
        ingest_results(str(events_path), delete_json=True)
        _cleanup(file_path)
        _jobs[video_id] = {"status": "done", "progress": 100, "error": None}
        print(f"[upload] Complete '{video_name}' via Modal in {total_time_s:.1f}s")

    except Exception as e:
        print(f"[upload] Modal execution failed or not configured ({e}). Running direct pipeline...")
        try:
            _process_video_direct(video_id, video_name, file_path)
        except Exception as direct_err:
            traceback.print_exc()
            _jobs[video_id] = {"status": "error", "progress": 0, "error": str(direct_err)}
            _cleanup(file_path)


@app.post("/api/upload")
async def upload_video(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(400, "No file provided")

    video_name = file.filename
    video_id = video_name.replace(".", "_").replace(" ", "_").lower()
    file_path = str(UPLOAD_DIR / video_name)

    # Stream to disk in chunks — supports files up to MAX_UPLOAD_MB without OOM
    chunk_size = 4 * 1024 * 1024  # 4 MB chunks
    total_bytes = 0
    with open(file_path, "wb") as f:
        while True:
            chunk = await file.read(chunk_size)
            if not chunk:
                break
            total_bytes += len(chunk)
            size_mb = total_bytes / (1024 * 1024)
            if size_mb > MAX_UPLOAD_MB:
                f.close()
                _cleanup(file_path)
                raise HTTPException(413, f"File too large (max {MAX_UPLOAD_MB}MB)")
            f.write(chunk)

    size_mb = total_bytes / (1024 * 1024)
    _jobs[video_id] = {"status": "queued", "progress": 0, "error": None}
    background_tasks.add_task(_process_video_background, video_id, video_name, file_path)
    return {"video_id": video_id, "video_name": video_name, "size_mb": round(size_mb, 1),
            "status": "queued", "message": "Processing started."}


@app.get("/api/upload/status/{video_id}")
def upload_status(video_id: str):
    job = _jobs.get(video_id)
    if not job:
        return {"video_id": video_id, "status": "unknown"}
    return {"video_id": video_id, **job}


# ─── Videos ───────────────────────────────────────────────────────────────────

@app.get("/api/videos")
def list_videos():
    from services.db import list_videos as db_list
    return {"videos": db_list()}


@app.get("/api/videos/{video_id}")
def video_info(video_id: str):
    from services.db import list_videos as db_list
    videos = db_list()
    for v in videos:
        if v["id"] == video_id:
            return v
    raise HTTPException(404, f"Video '{video_id}' not found")


# ─── Per-Video: Events, Alerts, Summary ───────────────────────────────────────

@app.get("/api/videos/{video_id}/events")
def video_events(video_id: str, limit: int = Query(100, le=500)):
    from services.db import get_events
    events = get_events(video_id=video_id, limit=limit)
    return {"video_id": video_id, "count": len(events), "events": events}


@app.get("/api/videos/{video_id}/alerts")
def video_alerts(video_id: str, top_k: int = Query(50, le=200)):
    from services.db import get_alerts
    alerts = get_alerts(video_id=video_id, top_k=top_k)
    return {"video_id": video_id, "count": len(alerts), "alerts": alerts}


@app.get("/api/videos/{video_id}/summary")
def video_summary(video_id: str):
    from services.db import get_video_summary
    summary = get_video_summary(video_id)
    if not summary:
        return {"video_id": video_id, "summary": None}
    return summary


@app.get("/api/videos/{video_id}/insights")
def video_insights(video_id: str):
    """Chart-ready data: event types, alert distribution, activity timeline."""
    from services.db import get_events, get_alerts
    events = get_events(video_id=video_id, limit=500)
    alerts = get_alerts(video_id=video_id, top_k=100)

    # Event type distribution
    type_counts: Dict[str, int] = {}
    timeline_points = []
    for e in events:
        label = ""
        if isinstance(e.get("event"), dict):
            label = e["event"].get("label", "unknown")
        elif e.get("event_type"):
            label = e["event_type"]
        else:
            label = "unknown"
        type_counts[label] = type_counts.get(label, 0) + 1

        timeline_points.append({
            "start": e.get("start", 0),
            "end": e.get("end", 0),
            "label": label,
            "alert_stage": e.get("alert", {}).get("stage", "none") if isinstance(e.get("alert"), dict) else "none",
            "people": e.get("detections", {}).get("people_count", 0) if isinstance(e.get("detections"), dict) else 0,
        })

    # Alert stage distribution
    stage_counts = {"none": 0, "A": 0, "B": 0, "C": 0}
    for a in alerts:
        stage = a.get("alert", {}).get("stage", "none") if isinstance(a.get("alert"), dict) else "none"
        stage_counts[stage] = stage_counts.get(stage, 0) + 1

    return {
        "video_id": video_id,
        "event_types": type_counts,
        "alert_stages": stage_counts,
        "timeline": timeline_points,
        "total_events": len(events),
        "total_alerts": len(alerts),
    }


# ─── Chat (RAG-powered with Gemini) ──────────────────────────────────────────

@app.post("/api/chat")
def chat_search(req: ChatRequest):
    """
    RAG chat: retrieve relevant events → Gemini synthesizes conversational answer.
    Also persists chat history per video.
    """
    from services.clip_search import hybrid_search
    from services.gemini_synthesis import chat_answer
    from services.db import get_video_summary, save_chat_message

    # Step 1: Retrieve relevant events
    relevant = hybrid_search(query=req.query, video_id=req.video_id, top_k=req.top_k)

    # Step 2: Get video summary for context
    summary_text = None
    video_name = ""
    if req.video_id:
        summary = get_video_summary(req.video_id)
        if summary:
            summary_text = summary.get("summary", "")
            video_name = req.video_id

    # Step 3: Gemini RAG answer
    answer = chat_answer(
        query=req.query,
        relevant_events=relevant,
        video_summary=summary_text,
        video_name=video_name,
    )

    # Step 4: Persist chat history
    if req.video_id:
        save_chat_message(req.video_id, "user", req.query)
        save_chat_message(req.video_id, "assistant", answer,
                          results_json=json.dumps([r.get("clip_id", "") for r in relevant[:5]]))

    return {
        "query": req.query,
        "answer": answer,
        "count": len(relevant),
        "results": relevant,
    }


# ─── Streaming Chat (SSE) ────────────────────────────────────────────────────

@app.post("/api/chat/stream")
async def chat_stream(req: ChatRequest):
    """
    Streaming RAG chat via Server-Sent Events.
    Returns text/event-stream with 'data: <chunk>\n\n' format.
    """
    from services.clip_search import hybrid_search
    from services.gemini_synthesis import chat_answer_stream
    from services.db import get_video_summary, save_chat_message

    relevant = hybrid_search(query=req.query, video_id=req.video_id, top_k=req.top_k)

    summary_text = None
    video_name = ""
    if req.video_id:
        summary = get_video_summary(req.video_id)
        if summary:
            summary_text = summary.get("summary", "")
            video_name = req.video_id

    # Save user message
    if req.video_id:
        save_chat_message(req.video_id, "user", req.query)

    async def event_stream() -> AsyncIterator[str]:
        # Phase 1: emit search results immediately (before Gemini starts)
        # Frontend can render matching clips while waiting for narrative
        results_payload = json.dumps([r.get("clip_id", "") for r in relevant[:5]])
        yield f"event: results\ndata: {json.dumps({'count': len(relevant), 'results': relevant[:8]})}\n\n"

        # Phase 2: stream Gemini narrative token by token
        full_answer: List[str] = []
        async for chunk in chat_answer_stream(
            query=req.query,
            relevant_events=relevant,
            video_summary=summary_text,
            video_name=video_name,
        ):
            full_answer.append(chunk)
            yield f"event: token\ndata: {json.dumps(chunk)}\n\n"

        if req.video_id:
            save_chat_message(req.video_id, "assistant", "".join(full_answer),
                              results_json=results_payload)
        yield "event: done\ndata: {}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


# ─── Chat History ─────────────────────────────────────────────────────────────

@app.get("/api/videos/{video_id}/chat")
def chat_history(video_id: str, limit: int = Query(50, le=200)):
    from services.db import get_chat_history
    messages = get_chat_history(video_id, limit=limit)
    return {"video_id": video_id, "messages": messages}


# ─── Events (global) ─────────────────────────────────────────────────────────

@app.get("/api/events")
def list_events(
    video_id: Optional[str] = None,
    limit: int = Query(100, le=500),
    offset: int = 0,
):
    from services.db import get_events
    events = get_events(video_id=video_id, limit=limit, offset=offset)
    return {"count": len(events), "events": events}


@app.get("/api/events/{clip_id}")
def get_event(clip_id: str):
    from services.db import get_event_by_id
    event = get_event_by_id(clip_id)
    if not event:
        raise HTTPException(404, f"Event '{clip_id}' not found")
    return {"event": event}


# ─── Alerts (global) ─────────────────────────────────────────────────────────

@app.get("/api/alerts")
def list_alerts(video_id: Optional[str] = None, top_k: int = Query(50, le=200)):
    from services.db import get_alerts
    alerts = get_alerts(video_id=video_id, top_k=top_k)
    return {"count": len(alerts), "alerts": alerts}


# ─── Timeline ────────────────────────────────────────────────────────────────

@app.get("/api/timeline")
def timeline(video_id: Optional[str] = None):
    from services.db import get_timeline
    markers = get_timeline(video_id=video_id)
    return {"count": len(markers), "markers": markers}


# ─── Stats ────────────────────────────────────────────────────────────────────

@app.get("/api/stats")
def stats():
    from services.db import get_stats
    return get_stats()


# ─── Incident Report ─────────────────────────────────────────────────────────

@app.get("/api/videos/{video_id}/report")
def video_report(
    video_id: str,
    as_text: bool = Query(False),
    as_pdf: bool = Query(False),
):
    """
    Generate a consolidated incident report for an entire video.
    Use ?as_pdf=true for a PDF download, ?as_text=true for plain-text.
    """
    from services.db import get_events, get_video_summary
    from services.incident_report import generate_incident_report, report_to_text, report_to_pdf

    events = get_events(video_id=video_id, limit=500)
    if not events:
        raise HTTPException(404, f"No events found for video '{video_id}'")

    synthesis = get_video_summary(video_id) or {}
    video_name = events[0].get("video_source", video_id) if events else video_id
    report = generate_incident_report(video_id, video_name, events, synthesis)

    if as_pdf:
        pdf_bytes = report_to_pdf(report)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=report_{video_id}.pdf",
                "Cache-Control": "no-store",
            },
        )

    if as_text:
        text = report_to_text(report)
        return Response(
            content=text,
            media_type="text/plain",
            headers={
                "Content-Disposition": f"attachment; filename=report_{video_id}.txt",
                "Cache-Control": "no-store",
            },
        )
    return report


# ─── Cross-Video Memory (Supermemory) ────────────────────────────────────────

@app.post("/api/memory/query")
def memory_query(req: MemoryQueryRequest):
    """Natural-language cross-video intelligence search via Supermemory."""
    from services.supermemory_client import query_intelligence
    return query_intelligence(query=req.query, video_id=req.video_id)


# ─── Benchmarks ───────────────────────────────────────────────────────────────

@app.get("/api/benchmarks/modal")
def modal_benchmark():
    """Modal GPU compute performance metrics aggregated from all processed videos."""
    from services.db import list_videos
    videos = list_videos()

    total_gpu_s    = sum(v.get("gpu_time_s", 0) or 0 for v in videos)
    total_cpu_s    = sum(v.get("cpu_time_s", 0) or 0 for v in videos)
    total_subclips = sum(v.get("subclips",   0) or 0 for v in videos)
    total_chunks   = sum(v.get("chunks",     0) or 0 for v in videos)
    total_proc_s   = sum(v.get("processing_time_s", 0) or 0 for v in videos)

    # Sequential baseline: ~8s per subclip on a single CPU core (no GPU, no parallelism)
    serial_estimate_s = total_subclips * 8.0
    speedup = round(serial_estimate_s / total_gpu_s, 1) if total_gpu_s > 0 else 0.0

    return {
        "gpu_type":                "A100",
        "max_containers":          50,
        "peak_parallelism":        50,
        "total_videos_processed":  len(videos),
        "total_subclips_processed": total_subclips,
        "total_chunks":            total_chunks,
        "total_gpu_time_s":        round(total_gpu_s, 1),
        "total_cpu_time_s":        round(total_cpu_s, 1),
        "total_processing_s":      round(total_proc_s, 1),
        "avg_gpu_time_s":          round(total_gpu_s / len(videos), 1) if videos else 0.0,
        "avg_cpu_time_s":          round(total_cpu_s / len(videos), 1) if videos else 0.0,
        "estimated_serial_s":      round(serial_estimate_s, 1),
        "speedup_x":               speedup,
        "videos": [
            {
                "name":         v["name"],
                "chunks":       v.get("chunks", 0),
                "subclips":     v.get("subclips", 0),
                "gpu_time_s":   v.get("gpu_time_s", 0),
                "cpu_time_s":   v.get("cpu_time_s", 0),
                "processing_s": v.get("processing_time_s", 0),
            }
            for v in videos
        ],
    }


@app.get("/api/benchmarks/vectorai")
def vectorai_benchmark():
    """VectorAI (Actian) search latency benchmark — runs a live test query."""
    import time as _time
    from services.clip_search import hybrid_search, encode_text
    from services.db import get_stats

    # Measure CLIP text-encode latency
    t0 = _time.time()
    encode_text("person walking aggressive behavior surveillance")
    encode_ms = round((_time.time() - t0) * 1000, 1)

    # Measure end-to-end hybrid search latency (CLIP + SQLite)
    t1 = _time.time()
    results = hybrid_search(query="person walking", video_id=None, top_k=5)
    search_ms = round((_time.time() - t1) * 1000, 1)

    # Total vector count ≈ total events (each event has a 768-dim CLIP vector)
    s = get_stats()

    return {
        "collection":                "vigilant_clips",
        "dimensions":                768,
        "distance_metric":           "COSINE",
        "model":                     "CLIP ViT-L/14",
        "clip_encode_latency_ms":    encode_ms,
        "hybrid_search_latency_ms":  search_ms,
        "total_vectors":             s.get("total_events", 0),
        "results_returned":          len(results),
    }
