import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Eye, Upload, Video, Shield, Activity, Loader2,
    ChevronRight, Plus, X, CheckCircle2, AlertCircle, Zap, BarChart3,
    Brain, Send, Sparkles, Globe, Search, Radio, Film
} from 'lucide-react'
import { api, type VideoInfo, type MemoryQueryResult } from '../api'

export default function HomePage() {
    const [videos, setVideos] = useState<VideoInfo[]>([])
    const [loading, setLoading] = useState(true)
    const [showUpload, setShowUpload] = useState(false)
    const navigate = useNavigate()

    const loadVideos = useCallback(() => {
        api.listVideos()
            .then(d => setVideos(d.videos || []))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { loadVideos() }, [loadVideos])

    const totalEvents = videos.reduce((s, v) => s + (v.total_events || 0), 0)
    const totalAlerts = videos.reduce((s, v) => s + (v.total_alerts || 0), 0)
    const totalTime   = videos.reduce((s, v) => s + (v.processing_time_s || 0), 0)

    return (
        <div className="min-h-screen bg-[#080c14] text-slate-100 relative overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
            {/* Ambient Tactical Atmosphere */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden bg-tactical-grid opacity-35" />
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 left-1/3 w-[650px] h-[450px] bg-gradient-to-br from-amber-500/10 via-orange-600/5 to-transparent rounded-full blur-3xl" />
                <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-gradient-to-br from-indigo-600/10 via-violet-600/5 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-10 w-[450px] h-[350px] bg-emerald-500/5 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-30 bg-[#080c14]/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-2xl shadow-black/40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                        <div className="relative w-10 h-10 group">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl blur-md opacity-60 group-hover:opacity-90 transition-opacity" />
                            <div className="relative w-10 h-10 bg-gradient-to-br from-[#121826] to-[#1c2438] border border-amber-500/40 rounded-xl flex items-center justify-center shadow-inner">
                                <Eye className="w-5 h-5 text-amber-400" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                                    Vigilant <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">AI</span>
                                </h1>
                                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    OPERATIONAL
                                </span>
                            </div>
                            <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">Sentinel Stream · Computer Vision</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={() => navigate('/benchmarks')}
                            className="cursor-pointer group flex items-center gap-1.5 px-3.5 py-2 text-zinc-300 hover:text-white bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/10 hover:border-white/20 rounded-xl text-xs font-semibold transition-all hover:shadow-lg hover:shadow-black/40 active:scale-95"
                        >
                            <BarChart3 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-400 transition-colors" />
                            <span>Benchmarks</span>
                        </button>
                        <button
                            onClick={() => setShowUpload(true)}
                            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-lg shadow-amber-500/25 ring-1 ring-white/20 hover:ring-white/30 active:scale-95"
                        >
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                            <span>Upload Video</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative z-10 space-y-7">
                {/* Cross-Video Intelligence */}
                <GlobalMemoryChat />

                {/* Telemetry Stats Bento Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <StatCard
                        icon={Film}
                        label="Videos Ingested"
                        value={videos.length}
                        accent="amber"
                        sub="Analyzed streams"
                    />
                    <StatCard
                        icon={Activity}
                        label="Total Events"
                        value={totalEvents}
                        accent="emerald"
                        sub="CV tracklets classified"
                    />
                    <StatCard
                        icon={Shield}
                        label="Total Alerts"
                        value={totalAlerts}
                        accent="red"
                        pulse={totalAlerts > 0}
                        sub="Threat windows flagged"
                    />
                    <StatCard
                        icon={Zap}
                        label="Compute Time"
                        value={`${totalTime.toFixed(0)}s`}
                        accent="violet"
                        sub="GPU inference active"
                    />
                </div>

                {/* Video list */}
                <div className="space-y-3.5">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Surveillance Feeds & Archives</h2>
                        </div>
                        {videos.length > 0 && (
                            <span className="text-xs font-mono text-zinc-400 bg-zinc-900/80 px-2.5 py-0.5 rounded-full border border-white/10">
                                {videos.length} video{videos.length !== 1 ? 's' : ''} loaded
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <div className="glass-panel rounded-2xl flex items-center justify-center py-24 border border-white/10">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
                                <p className="text-xs text-zinc-400 font-mono tracking-wide">Querying database...</p>
                            </div>
                        </div>
                    ) : videos.length === 0 ? (
                        <div className="text-center py-24 border border-dashed border-white/15 rounded-2xl glass-panel relative overflow-hidden">
                            <div className="w-16 h-16 mx-auto mb-4 bg-zinc-900/90 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                                <Video className="w-7 h-7 text-zinc-500" />
                            </div>
                            <h3 className="text-zinc-200 text-base font-semibold mb-1">No surveillance footage ingested</h3>
                            <p className="text-zinc-400 text-xs max-w-sm mx-auto mb-6 leading-relaxed">
                                Upload CCTV, drone, or security camera footage to trigger YOLO11 motion tracking, Gemini multimodal forensic analysis, and RAG search.
                            </p>
                            <button
                                onClick={() => setShowUpload(true)}
                                className="cursor-pointer px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-lg shadow-amber-500/25 ring-1 ring-white/20 active:scale-95"
                            >
                                Upload first video
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {videos.map((v, i) => (
                                <VideoCard key={v.id} video={v} index={i} onClick={() => navigate(`/video/${v.id}`)} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {showUpload && (
                <UploadModal
                    onClose={() => setShowUpload(false)}
                    onDone={() => { setShowUpload(false); loadVideos() }}
                />
            )}

            <footer className="relative z-10 border-t border-white/[0.06] mt-16 py-6 text-center text-[11px] text-zinc-500 font-mono tracking-wider">
                VIGILANT AI · ENTERPRISE VIDEO INTELLIGENCE & FORENSICS
            </footer>
        </div>
    )
}

// ─── GlobalMemoryChat ─────────────────────────────────────────────────────────

function GlobalMemoryChat() {
    const [query, setQuery]   = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<MemoryQueryResult | null>(null)
    const [error, setError]   = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const SUGGESTIONS = [
        'Any high-risk incidents detected?',
        'Were there any fights or assaults?',
        'Show me all shoplifting events',
        'Any trespassing or unauthorized access?',
    ]

    const ask = async (q: string) => {
        const trimmed = q.trim()
        if (!trimmed) return
        setQuery(trimmed); setLoading(true); setError(''); setResult(null)
        try {
            setResult(await api.queryMemory(trimmed))
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Query failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden border border-white/[0.09] glow-indigo">
            {/* Top ambient glow */}
            <div className="absolute top-0 right-1/4 w-72 h-32 bg-violet-500/10 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="relative w-9 h-9 shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl blur-sm opacity-50" />
                    <div className="relative w-9 h-9 bg-gradient-to-br from-violet-600/80 to-indigo-700/80 border border-violet-400/40 rounded-xl flex items-center justify-center shadow-inner">
                        <Brain className="w-4 h-4 text-white" />
                    </div>
                </div>
                <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Cross-Video Intelligence</span>
                        <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 bg-violet-500/15 text-violet-300 border border-violet-500/30 rounded-full font-mono font-semibold tracking-wider uppercase">
                            <Sparkles className="w-2.5 h-2.5 text-violet-400" /> Supermemory
                        </span>
                    </h2>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                        Correlate patterns, incidents, and suspicious individuals across <em>all</em> surveillance cameras and archives
                    </p>
                </div>
            </div>

            {/* Search Input Box */}
            <div className="bg-zinc-950/70 border border-white/10 rounded-xl shadow-inner focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all relative z-10">
                <div className="flex items-center gap-3 px-4 py-3">
                    <Globe className="w-4 h-4 text-zinc-500 shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && ask(query)}
                        placeholder="Ask anything across all camera feeds, e.g. 'Were there any prowlers or thefts?'"
                        className="flex-1 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none bg-transparent"
                    />
                    <button
                        onClick={() => ask(query)}
                        disabled={loading || !query.trim()}
                        className="cursor-pointer shrink-0 p-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white rounded-lg transition-all active:scale-95 disabled:cursor-not-allowed shadow-md"
                        title="Search"
                    >
                        {loading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
                    </button>
                </div>
            </div>

            {/* Suggestion chips */}
            {!result && !loading && (
                <div className="flex flex-wrap gap-2 mt-3.5 relative z-10">
                    {SUGGESTIONS.map(s => (
                        <button
                            key={s}
                            onClick={() => ask(s)}
                            className="cursor-pointer flex items-center gap-1.5 text-[11px] px-2.5 py-1 bg-zinc-900/80 hover:bg-zinc-800/90 border border-white/[0.08] hover:border-violet-500/40 text-zinc-400 hover:text-zinc-200 rounded-lg transition-all"
                        >
                            <Search className="w-2.5 h-2.5 text-zinc-500" />
                            <span>{s}</span>
                        </button>
                    ))}
                </div>
            )}

            {error && (
                <div className="mt-3.5 flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-500/30 px-3.5 py-2.5 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{error}</span>
                </div>
            )}

            {loading && (
                <div className="mt-4 flex items-center gap-2.5 text-xs font-mono text-zinc-400">
                    <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                    <span>Aggregating cross-video intelligence embeddings...</span>
                </div>
            )}

            {result && !loading && (
                <div className="mt-4 animate-fade-up space-y-3 relative z-10">
                    <div className="bg-violet-950/30 border border-violet-500/30 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-1.5 mb-2">
                            <Brain className="w-3.5 h-3.5 text-violet-400" />
                            <span className="text-[10px] text-violet-300 font-mono font-semibold uppercase tracking-wider">AI Correlation Analysis</span>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                            {result.configured
                                ? result.answer
                                : 'Supermemory is not configured. Add SUPERMEMORY_API_KEY to backend/.env to persist cross-video memories.'}
                        </p>
                    </div>

                    {result.memories && result.memories.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono font-semibold px-1">
                                Matched Evidence Records ({result.memories.length})
                            </p>
                            {result.memories.slice(0, 3).map((m, i) => (
                                <div key={i} className="bg-zinc-900/60 border border-white/[0.08] rounded-xl p-3 shadow-sm">
                                    <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">{m.content?.slice(0, 250)}...</p>
                                    {m.score != null && (
                                        <span className="text-[10px] font-mono text-violet-400 mt-1 inline-block">
                                            similarity confidence: {(m.score * 100).toFixed(0)}%
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={() => { setResult(null); setQuery(''); inputRef.current?.focus() }}
                        className="cursor-pointer text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors pt-1 inline-flex items-center gap-1"
                    >
                        ← Query different topic
                    </button>
                </div>
            )}
        </div>
    )
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, accent, pulse, sub }: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: string | number
    accent: 'amber' | 'emerald' | 'red' | 'violet'
    pulse?: boolean
    sub?: string
}) {
    const accents = {
        amber:   { border: 'border-amber-500/30 hover:border-amber-500/50', iconBg: 'bg-amber-500/15 border-amber-500/30', icon: 'text-amber-400', val: 'text-amber-300', glow: 'glow-amber' },
        emerald: { border: 'border-emerald-500/30 hover:border-emerald-500/50', iconBg: 'bg-emerald-500/15 border-emerald-500/30', icon: 'text-emerald-400', val: 'text-emerald-300', glow: 'glow-emerald' },
        red:     { border: 'border-red-500/30 hover:border-red-500/50', iconBg: 'bg-red-500/15 border-red-500/30', icon: 'text-red-400', val: 'text-red-400', glow: 'glow-red' },
        violet:  { border: 'border-violet-500/30 hover:border-violet-500/50', iconBg: 'bg-violet-500/15 border-violet-500/30', icon: 'text-violet-400', val: 'text-violet-300', glow: 'glow-indigo' },
    }
    const c = accents[accent] || accents.amber

    return (
        <div className={`glass-card rounded-2xl p-4.5 border ${c.border} relative overflow-hidden group`}>
            <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${c.iconBg}`}>
                        <Icon className={`w-3.5 h-3.5 ${c.icon}`} />
                    </div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono font-semibold">{label}</span>
                </div>
                {pulse && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
            </div>
            <div className="flex items-baseline justify-between mt-1">
                <p className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${c.val}`}>{value}</p>
            </div>
            {sub && <p className="text-[10px] text-zinc-500 mt-1 truncate">{sub}</p>}
        </div>
    )
}

// ─── VideoCard ────────────────────────────────────────────────────────────────

function VideoCard({ video: v, index, onClick }: { video: VideoInfo; index: number; onClick: () => void }) {
    const alertLevel = v.total_alerts > 5 ? 'high' : v.total_alerts > 0 ? 'medium' : 'none'
    const borderStyle = alertLevel === 'high'
        ? 'border-red-500/30 hover:border-red-500/60 glow-red'
        : alertLevel === 'medium'
            ? 'border-orange-500/30 hover:border-orange-500/60 glow-amber'
            : 'border-white/[0.08] hover:border-white/20'

    return (
        <button
            onClick={onClick}
            className={`cursor-pointer group w-full text-left glass-card rounded-2xl p-4 sm:p-5 border ${borderStyle} transition-all animate-fade-up relative overflow-hidden`}
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 bg-zinc-900/90 rounded-xl flex items-center justify-center border border-white/10 shrink-0 group-hover:border-amber-500/40 transition-colors shadow-inner">
                        <Video className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-zinc-100 truncate group-hover:text-amber-300 transition-colors">
                            {v.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1 font-mono">
                            <span>{(v.duration_s / 60).toFixed(1)} min</span>
                            <span className="text-zinc-600">·</span>
                            <span>{v.total_events} event{v.total_events !== 1 ? 's' : ''}</span>
                            {v.subclips != null && v.subclips > 0 && (
                                <>
                                    <span className="text-zinc-600">·</span>
                                    <span className="hidden sm:inline">{v.subclips} subclips</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                    {v.total_alerts > 0 ? (
                        <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border font-mono font-semibold ${
                            alertLevel === 'high'
                                ? 'bg-red-500/15 text-red-400 border-red-500/40'
                                : 'bg-orange-500/15 text-orange-400 border-orange-500/40'
                        }`}>
                            <Shield className="w-3.5 h-3.5" />
                            <span>{v.total_alerts} Alert{v.total_alerts !== 1 ? 's' : ''}</span>
                        </span>
                    ) : (
                        <span className="hidden sm:flex items-center gap-1 text-[11px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20 font-mono">
                            NORMAL
                        </span>
                    )}

                    {v.gpu && (
                        <span className="hidden md:flex items-center gap-1 text-[10px] px-2 py-1 bg-violet-500/10 text-violet-300 rounded-lg border border-violet-500/25 font-mono">
                            <Zap className="w-3 h-3 text-violet-400" />
                            <span>{v.gpu}</span>
                        </span>
                    )}

                    <div className="w-7 h-7 rounded-lg bg-zinc-900/60 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-800 transition-all">
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </div>
            </div>
        </button>
    )
}

// ─── UploadModal ──────────────────────────────────────────────────────────────

function UploadModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
    const [file, setFile] = useState<File | null>(null)
    const [dragging, setDragging] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [processingStatus, setProcessingStatus] = useState('')
    const [error, setError] = useState('')
    const [done, setDone] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    const handleFile = (f: File) => {
        setError('')
        if (f.size > 5120 * 1024 * 1024) { setError('File too large. Maximum size is 5GB.'); return }
        if (!f.type.startsWith('video/')) { setError('Please select a video file.'); return }
        setFile(f)
    }

    const handleUpload = async () => {
        if (!file) return
        setUploading(true); setError('')
        try {
            const res = await api.uploadVideo(file, setUploadProgress)
            setProcessingStatus('Processing video with motion tracking...')
            const poll = setInterval(async () => {
                try {
                    const status = await api.uploadStatus(res.video_id)
                    setProcessingStatus(
                        status.status === 'uploading'  ? 'Uploading to processing server...' :
                        status.status === 'processing' ? `Analyzing video subclips... ${status.progress}%` :
                        status.status === 'analyzing'  ? 'Gemini 3.5 forensic synthesis in progress...' :
                        status.status === 'done'       ? 'Analysis Complete!' :
                        status.status === 'error'      ? `Error: ${status.error}` : 'Queued in pipeline...'
                    )
                    if (status.status === 'done') {
                        clearInterval(poll); setDone(true); setTimeout(onDone, 1400)
                    } else if (status.status === 'error') {
                        clearInterval(poll); setError(status.error || 'Processing failed'); setUploading(false)
                    }
                } catch { /* keep polling */ }
            }, 2000)
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Upload failed'); setUploading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-[#0d121e] rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-2xl border border-white/10 animate-fade-up">
                <button
                    onClick={onClose}
                    className="cursor-pointer absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-lg transition-all"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Upload className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white">Upload Surveillance Footage</h3>
                    </div>
                </div>
                <p className="text-xs text-zinc-400 mb-5 ml-11">MP4, AVI, MOV — Up to 5GB</p>

                {done ? (
                    <div className="text-center py-10 animate-fade-up">
                        <div className="w-14 h-14 bg-emerald-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 glow-emerald">
                            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                        </div>
                        <p className="text-sm text-emerald-400 font-semibold font-mono">Video Analysis Ingested!</p>
                        <p className="text-xs text-zinc-400 mt-1">Opening surveillance workspace...</p>
                    </div>
                ) : (
                    <>
                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
                            onClick={() => fileRef.current?.click()}
                            className={`cursor-pointer border-2 border-dashed rounded-2xl p-7 text-center transition-all ${
                                dragging
                                    ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                                    : file
                                        ? 'border-emerald-400/50 bg-emerald-500/10'
                                        : 'border-white/15 hover:border-amber-400/40 bg-zinc-900/50 hover:bg-zinc-900/80'
                            }`}
                        >
                            <input
                                ref={fileRef}
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                            />
                            {file ? (
                                <div className="animate-fade-up">
                                    <div className="w-11 h-11 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-2.5 border border-emerald-500/40">
                                        <Video className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <p className="text-xs sm:text-sm text-zinc-100 font-semibold truncate max-w-xs mx-auto">{file.name}</p>
                                    <p className="text-xs text-emerald-400 font-mono mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB ready to analyze</p>
                                </div>
                            ) : (
                                <div>
                                    <div className="w-11 h-11 bg-zinc-800/80 rounded-xl flex items-center justify-center mx-auto mb-2.5 border border-white/5">
                                        <Upload className="w-5 h-5 text-zinc-400" />
                                    </div>
                                    <p className="text-xs sm:text-sm text-zinc-200 font-medium">Drag & drop surveillance clip or browse</p>
                                    <p className="text-[11px] text-zinc-500 mt-1 font-mono">YOLO11 motion segmentation + Gemini vision</p>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="mt-3.5 flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-500/30 px-3.5 py-2.5 rounded-xl animate-fade-up">
                                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                                <span>{error}</span>
                            </div>
                        )}

                        {uploading && (
                            <div className="mt-4.5 animate-fade-up space-y-2">
                                <div className="flex items-center justify-between text-xs text-zinc-300 font-mono">
                                    <span className="truncate max-w-[280px]">{processingStatus || `Uploading... ${uploadProgress}%`}</span>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400 shrink-0" />
                                </div>
                                <div className="h-2 bg-zinc-950 rounded-full overflow-hidden border border-white/10">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 rounded-full transition-all duration-500"
                                        style={{ width: `${processingStatus ? 100 : uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {!uploading && (
                            <button
                                onClick={handleUpload}
                                disabled={!file}
                                className="cursor-pointer mt-5 w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] disabled:cursor-not-allowed border border-white/10"
                            >
                                Ingest & Run AI Surveillance
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
