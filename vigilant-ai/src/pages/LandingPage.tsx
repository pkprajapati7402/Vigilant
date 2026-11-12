import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flaticon } from '../components/Flaticon'

export default function LandingPage() {
    const navigate = useNavigate()
    const [selectedQuery, setSelectedQuery] = useState(0)

    const DEMO_QUERIES = [
        {
            q: "Show anyone climbing or crawling near the entrance after midnight",
            badge: "STAGE C · CRITICAL",
            badgeCls: "bg-red-50 text-red-600 border-red-200",
            time: "00:14 – 00:26",
            cam: "CAM-01 · North Entrance",
            synopsis: "Subject observed crawling low along perimeter floor towards service entrance. Gemini flagged evasive posture and erratic motion pattern.",
            intent: "unauthorized_entry",
            matchScore: 98.6
        },
        {
            q: "Was an unattended bag left in the central lobby?",
            badge: "STAGE B · WARNING",
            badgeCls: "bg-orange-50 text-orange-600 border-orange-200",
            time: "01:05 – 01:28",
            cam: "CAM-03 · Central Atrium",
            synopsis: "Black backpack placed beside seating column. Owner departed camera field of view; item remained stationary exceeding 22-second dwell threshold.",
            intent: "unattended_baggage",
            matchScore: 94.2
        },
        {
            q: "Did any vehicle stop in the emergency loading zone?",
            badge: "STAGE A · NOTICE",
            badgeCls: "bg-amber-50 text-amber-700 border-amber-200",
            time: "02:40 – 02:48",
            cam: "CAM-02 · Emergency Bay",
            synopsis: "Silver delivery van idling in designated red zone with hazard lights inactive. YOLO11 vehicle tracking logged 8-minute dwell.",
            intent: "parking_violation",
            matchScore: 91.0
        }
    ]

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
            {/* Top Navigation */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Brand */}
                    <div
                        onClick={() => navigate('/')}
                        className="cursor-pointer flex items-center gap-3 group"
                    >
                        <div className="w-10 h-10 rounded-xl border border-blue-200 bg-white flex items-center justify-center text-blue-600 shadow-xs group-hover:border-blue-400 transition-colors">
                            <Flaticon name="shield-check" type="sr" className="text-xl text-blue-600" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none">
                                    Vigilant AI
                                </span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                                    ENTERPRISE
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-normal">
                                Autonomous Surveillance Intelligence
                            </p>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
                        <a href="#problem" className="hover:text-blue-600 transition-colors">The Problem</a>
                        <a href="#capabilities" className="hover:text-blue-600 transition-colors">Capabilities</a>
                        <a href="#architecture" className="hover:text-blue-600 transition-colors">Architecture</a>
                        <a href="#demo" className="hover:text-blue-600 transition-colors">Interactive Demo</a>
                        <button
                            onClick={() => navigate('/benchmarks')}
                            className="hover:text-blue-600 transition-colors cursor-pointer"
                        >
                            Benchmarks
                        </button>
                    </nav>

                    {/* Header Action Button */}
                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-medium text-emerald-700">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Cloud T4 GPU Active</span>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="cursor-pointer flex items-center gap-2 px-4.5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all active:scale-95"
                        >
                            <span>Get Started</span>
                            <Flaticon name="angle-small-right" className="text-xs" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-6">
                    {/* Announcement Pill */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs animate-fade-in">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                        <span>NEXT-GEN SURVEILLANCE · ZERO MANUAL TIMELINE SCRUBBING</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] max-w-4xl mx-auto">
                        Hundreds of Cameras Recording.{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500">
                            Virtually None Monitored in Real Time.
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        99% of surveillance cameras in airports, warehouses, retail centers, and enterprise campuses record passively to cold storage. Human teams only review footage <strong className="text-slate-800">after</strong> a breach has already happened.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        Vigilant AI monitors every camera feed simultaneously with <strong className="text-blue-600">YOLO11</strong> high-speed tracklets, analyzes behavioral intent using <strong className="text-indigo-600">Gemini 2.5</strong>, and lets security operators interrogate hundreds of hours in plain English.
                    </p>

                    {/* CTAs */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
                        >
                            <span>Get Started — Open Console</span>
                            <Flaticon name="angle-small-right" className="text-sm" />
                        </button>
                        <button
                            onClick={() => navigate('/benchmarks')}
                            className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all hover:border-slate-300"
                        >
                            <Flaticon name="stats" className="text-slate-500 text-xs" />
                            <span>System Compute Benchmarks</span>
                        </button>
                    </div>

                    {/* Stats Banner */}
                    <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
                        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4.5 shadow-xs">
                            <div className="flex items-center gap-2 text-blue-600 mb-1">
                                <Flaticon name="video-camera" type="sr" className="text-sm" />
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Feed Scale</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 font-sans">100+ Feeds</p>
                            <p className="text-xs text-slate-500 mt-0.5">Continuous concurrent ingest</p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4.5 shadow-xs">
                            <div className="flex items-center gap-2 text-emerald-600 mb-1">
                                <Flaticon name="bolt" type="sr" className="text-sm" />
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Inference Speed</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 font-sans">50+ FPS</p>
                            <p className="text-xs text-slate-500 mt-0.5">Real-time GPU tracklet velocity</p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4.5 shadow-xs">
                            <div className="flex items-center gap-2 text-purple-600 mb-1">
                                <Flaticon name="search" className="text-sm" />
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Query Latency</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 font-sans">&lt; 1.2s</p>
                            <p className="text-xs text-slate-500 mt-0.5">Semantic cross-modal search</p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4.5 shadow-xs">
                            <div className="flex items-center gap-2 text-orange-600 mb-1">
                                <Flaticon name="shield" type="sr" className="text-sm" />
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Review Time</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 font-sans">-99.2%</p>
                            <p className="text-xs text-slate-500 mt-0.5">Manual scrub time eliminated</p>
                        </div>
                    </div>
                </div>

                {/* Hero Product Visual Illustration */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                    <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-slate-900 shadow-2xl">
                        {/* Static Product Illustration Image */}
                        <img
                            src="/hero-surveillance.jpg"
                            alt="Vigilant AI Smart Surveillance Network Illustration"
                            className="w-full h-auto object-cover max-h-[520px] opacity-95 hover:scale-[1.01] transition-transform duration-700"
                        />

                        {/* Floating Live Telemetry Cards over the image */}
                        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md border border-white/15 rounded-xl px-3.5 py-2 text-white flex items-center gap-2.5 shadow-lg">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                            <span className="text-xs font-mono font-semibold">CAM-01 · PERIMETER SENTRY</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 font-bold">STAGE C</span>
                        </div>

                        <div className="absolute bottom-4 right-4 bg-slate-900/85 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-white max-w-sm hidden sm:block shadow-xl">
                            <div className="flex items-center gap-2 mb-1.5">
                                <Flaticon name="brain" type="sr" className="text-blue-400 text-xs" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Gemini Multimodal Reasoning</span>
                            </div>
                            <p className="text-xs text-slate-200 leading-relaxed font-sans">
                                "Subject detected crouching behind restricted barrier at 00:14. Evasive velocity vector confirmed. Security dispatch alerted."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Problem: Modern Camera Blindspot */}
            <section id="problem" className="py-16 md:py-24 bg-white border-y border-slate-200/80">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                            THE SURVEILLANCE PARADOX
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            More Cameras Do Not Mean More Safety.
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                            A single human security operator monitoring 12 CCTV screens misses over 95% of subtle motion events after just 22 minutes. Modern security infrastructure is recording blindly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                        {/* Legacy Way */}
                        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                                    ✕
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Legacy CCTV (Passive Cold Storage)</h3>
                                    <p className="text-xs text-slate-400">The current standard across 90% of facilities</p>
                                </div>
                            </div>
                            <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                                <li className="flex items-start gap-2.5">
                                    <span className="text-red-500 font-bold shrink-0 mt-0.5">•</span>
                                    <span><strong>Purely Reactive:</strong> Zero real-time alerts. Guards only review tapes days after burglary or damage occurred.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-red-500 font-bold shrink-0 mt-0.5">•</span>
                                    <span><strong>Painful Manual Scrubbing:</strong> Investigators spend 8 to 20 hours rewinding 16-channel video files frame by frame.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-red-500 font-bold shrink-0 mt-0.5">•</span>
                                    <span><strong>Zero Semantic Search:</strong> You cannot ask your NVR: <em>"Where did the person in the yellow hoodie go?"</em></span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-red-500 font-bold shrink-0 mt-0.5">•</span>
                                    <span><strong>High Human Error:</strong> Human vigilance fatigue causes critical moments to slip through undetected.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Vigilant AI Way */}
                        <div className="bg-blue-50/50 border border-blue-200/80 rounded-3xl p-6 sm:p-8 space-y-5 relative overflow-hidden">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                                    ✓
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Vigilant AI (Autonomous Sentinel Stream)</h3>
                                    <p className="text-xs text-blue-600 font-medium">Continuous real-time computer vision + LLM intelligence</p>
                                </div>
                            </div>
                            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                                <li className="flex items-start gap-2.5">
                                    <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
                                    <span><strong>Instant Threat Triage:</strong> YOLO11 extracts movement tracklets in milliseconds, escalating Stage C threats instantly.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
                                    <span><strong>Natural Language Query:</strong> Search 100s of hours of footage in plain English like ChatGPT with instant timecodes.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
                                    <span><strong>Multimodal Behavioral Reasoning:</strong> Gemini 2.5 Flash distinguishes benign actions from stealth, theft, or altercations.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
                                    <span><strong>Court-Ready Forensic Reports:</strong> Auto-generate PDF/TXT incident reports with chronological proof in 1 click.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Capabilities Bento */}
            <section id="capabilities" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        PRODUCT PILLARS
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Built for Modern High-Density Security.
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        Combining high-throughput edge computer vision with deep reasoning multimodal foundation models.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Capability 1 */}
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-5">
                                <Flaticon name="pulse" className="text-xl text-blue-600" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-2">
                                Autonomous Anomaly Tracking
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                YOLO11 processes 50+ FPS directly on GPU, continuously tracking velocity vectors, spatial bounding boxes, and perimeter dwell times.
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-[11px] font-mono text-slate-600 flex items-center justify-between">
                            <span>Tracklet Latency:</span>
                            <span className="text-blue-600 font-bold">18.2ms / frame</span>
                        </div>
                    </div>

                    {/* Capability 2 */}
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5">
                                <Flaticon name="brain" type="sr" className="text-xl text-indigo-600" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-2">
                                Multimodal Behavioral Intent
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                Google Gemini 2.5 Flash analyzes behavioral nuance—differentiating between an employee tying their shoe versus a suspect crawling under a cash register.
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-[11px] font-mono text-slate-600 flex items-center justify-between">
                            <span>Verification Logic:</span>
                            <span className="text-indigo-600 font-bold">Dual-Model Union</span>
                        </div>
                    </div>

                    {/* Capability 3 */}
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-5">
                                <Flaticon name="search" className="text-xl text-emerald-600" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-2">
                                Cross-Modal Natural Language Search
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                OpenAI CLIP ViT-L/14 maps frames and descriptive language into a unified 768-dimensional vector space for sub-second nearest-neighbor semantic search.
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-[11px] font-mono text-slate-600 flex items-center justify-between">
                            <span>Vector Similarity:</span>
                            <span className="text-emerald-600 font-bold">Cosine (Sub-50ms)</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Query Sandbox */}
            <section id="demo" className="py-16 md:py-24 bg-white border-t border-slate-200/80">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="text-center max-w-xl mx-auto space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                            INTERACTIVE FORENSIC SEARCH
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Experience Natural Language Video Retrieval
                        </h2>
                        <p className="text-xs text-slate-500">
                            Click a simulated query below to see how Vigilant AI indexes and cites visual evidence instantly.
                        </p>
                    </div>

                    {/* Query Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                        {DEMO_QUERIES.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedQuery(idx)}
                                className={`cursor-pointer px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                                    selectedQuery === idx
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                {item.q}
                            </button>
                        ))}
                    </div>

                    {/* Result Preview Box */}
                    {DEMO_QUERIES[selectedQuery] && (
                        <div className="bg-[#F8FAFC] border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 animate-fade-in">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${DEMO_QUERIES[selectedQuery].badgeCls}`}>
                                        {DEMO_QUERIES[selectedQuery].badge}
                                    </span>
                                    <span className="text-xs font-mono font-bold text-slate-700">
                                        {DEMO_QUERIES[selectedQuery].cam}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                                    <span>Timecode: <strong className="text-blue-600 font-bold">{DEMO_QUERIES[selectedQuery].time}</strong></span>
                                    <span>·</span>
                                    <span>Match: <strong className="text-emerald-600 font-bold">{DEMO_QUERIES[selectedQuery].matchScore}%</strong></span>
                                </div>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                {DEMO_QUERIES[selectedQuery].synopsis}
                            </p>

                            <div className="pt-2 flex items-center justify-between text-xs">
                                <span className="text-[11px] font-mono text-slate-400">Classified Intent: #{DEMO_QUERIES[selectedQuery].intent}</span>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="cursor-pointer font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                >
                                    <span>Inspect in Full Console</span>
                                    <Flaticon name="angle-small-right" className="text-xs" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Architecture Overview */}
            <section id="architecture" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        HIERARCHICAL ENGINE
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Pyramid of Compute: How We Process at Scale
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        Heavy foundation models cannot run on 30 FPS raw video. Vigilant AI cascades compute across 4 layers to maintain real-time speed at fraction of cloud cost.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">Layer 1 · CPU</span>
                        <h4 className="text-sm font-bold text-slate-900">Motion Slicing</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Frame differencing optical velocity drops 75% of static, empty footage before touching a GPU.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 uppercase">Layer 2 · GPU</span>
                        <h4 className="text-sm font-bold text-slate-900">YOLO11 Tracklets</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Extracts spatial bounding boxes, person counts, and velocity vectors at 50+ FPS real-time.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-600 uppercase">Layer 3 · Vector</span>
                        <h4 className="text-sm font-bold text-slate-900">CLIP Embeddings</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Encodes keyframes into 768-D vectors stored for sub-50ms cosine similarity natural language search.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 uppercase">Layer 4 · LLM</span>
                        <h4 className="text-sm font-bold text-slate-900">Gemini 2.5 Intent</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Synthesizes forensic narrative, verifies criminal intent, and assigns Stage A/B/C severity levels.
                        </p>
                    </div>
                </div>
            </section>

            {/* Bottom Call to Action Banner */}
            <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50/50 border-t border-slate-200/80 text-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Transform Your Camera Network Into Autonomous Intelligence.
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                        Ready to see how Vigilant AI monitors surveillance footage without human fatigue? Launch the live console or test compute benchmarks.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all active:scale-95"
                        >
                            <span>Get Started — Launch Console</span>
                            <Flaticon name="angle-small-right" className="text-sm" />
                        </button>
                        <button
                            onClick={() => navigate('/benchmarks')}
                            className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all"
                        >
                            <Flaticon name="stats" className="text-slate-500 text-xs" />
                            <span>View Benchmarks</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Enterprise Footer */}
            <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Flaticon name="shield-check" type="sr" className="text-xs" />
                        </div>
                        <span className="font-bold text-slate-800">Vigilant AI · Sentinel Stream</span>
                        <span>© 2026</span>
                    </div>

                    <div className="flex items-center gap-6 font-medium text-slate-600">
                        <button onClick={() => navigate('/dashboard')} className="hover:text-blue-600 cursor-pointer">Console</button>
                        <button onClick={() => navigate('/benchmarks')} className="hover:text-blue-600 cursor-pointer">Benchmarks</button>
                        <span className="text-slate-400">Powered by Gemini 2.5 Flash & YOLO11</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}
