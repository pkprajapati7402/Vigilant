import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Shield, Upload, Video, Activity, Loader2,
    ChevronRight, Plus, X, CheckCircle2, AlertCircle, BarChart3,
    Brain, Send, Search, RotateCcw, Bell,
    Folder, Cpu, Settings, FileText, ArrowDownToLine
} from 'lucide-react'
import { api, type VideoInfo, type MemoryQueryResult } from '../api'

export default function HomePage() {
    const [videos, setVideos] = useState<VideoInfo[]>([])
    const [loading, setLoading] = useState(true)
    const [showUpload, setShowUpload] = useState(false)
    const [activeNav, setActiveNav] = useState('dashboard')
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
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl border border-blue-200/90 bg-white flex items-center justify-center shadow-xs">
                            <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <ellipse cx="12" cy="11.5" rx="3.5" ry="2" />
                                <circle cx="12" cy="11.5" r="1" fill="currentColor" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                                Vigilant AI
                            </h1>
                            <p className="text-xs text-slate-400 font-normal">
                                Sentinel Stream  ·  Computer Vision
                            </p>
                        </div>
                    </div>

                    {/* Header Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/benchmarks')}
                            className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all hover:border-slate-300"
                        >
                            <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                            <span>Benchmarks</span>
                        </button>
                        <button
                            onClick={() => setShowUpload(true)}
                            className="cursor-pointer flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                            <span>Upload Video</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Layout Body: Sidebar + Main Area */}
            <div className="flex-1 max-w-7xl w-full mx-auto flex">
                {/* Left Sidebar */}
                <aside className="w-60 shrink-0 hidden md:flex flex-col justify-between py-6 px-4 border-r border-slate-200/80 bg-[#F8FAFC]">
                    <div className="space-y-6">
                        {/* Active Item */}
                        <div>
                            <button
                                onClick={() => setActiveNav('dashboard')}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-semibold text-xs sm:text-sm text-left transition-all"
                            >
                                <ArrowDownToLine className="w-4 h-4 text-blue-600" />
                                <span>Dashboard</span>
                            </button>
                        </div>

                        {/* ANALYTICS Section */}
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-1.5">
                                ANALYTICS
                            </p>
                            <nav className="space-y-0.5">
                                <SidebarItem
                                    icon={Search}
                                    label="Cross-Video Intelligence"
                                    active={activeNav === 'intelligence'}
                                    onClick={() => {
                                        setActiveNav('intelligence')
                                        document.getElementById('intelligence-box')?.scrollIntoView({ behavior: 'smooth' })
                                    }}
                                />
                                <SidebarItem
                                    icon={Bell}
                                    label="Alerts"
                                    active={activeNav === 'alerts'}
                                    onClick={() => {
                                        setActiveNav('alerts')
                                        document.getElementById('feeds-section')?.scrollIntoView({ behavior: 'smooth' })
                                    }}
                                />
                                <SidebarItem
                                    icon={Activity}
                                    label="Events"
                                    active={activeNav === 'events'}
                                    onClick={() => {
                                        setActiveNav('events')
                                        document.getElementById('feeds-section')?.scrollIntoView({ behavior: 'smooth' })
                                    }}
                                />
                                <SidebarItem
                                    icon={Folder}
                                    label="Feeds & Archives"
                                    active={activeNav === 'feeds'}
                                    onClick={() => {
                                        setActiveNav('feeds')
                                        document.getElementById('feeds-section')?.scrollIntoView({ behavior: 'smooth' })
                                    }}
                                />
                            </nav>
                        </div>

                        {/* SYSTEM Section */}
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-1.5">
                                SYSTEM
                            </p>
                            <nav className="space-y-0.5">
                                <SidebarItem
                                    icon={Cpu}
                                    label="Compute & Status"
                                    active={activeNav === 'compute'}
                                    onClick={() => navigate('/benchmarks')}
                                />
                                <SidebarItem
                                    icon={Settings}
                                    label="Settings"
                                    active={activeNav === 'settings'}
                                    onClick={() => setActiveNav('settings')}
                                />
                                <SidebarItem
                                    icon={FileText}
                                    label="Activity Log"
                                    active={activeNav === 'logs'}
                                    onClick={() => setActiveNav('logs')}
                                />
                            </nav>
                        </div>
                    </div>

                    {/* System Status bottom widget */}
                    <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs space-y-1">
                        <p className="text-xs font-semibold text-slate-700">System Status</p>
                        <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Operational
                        </p>
                        <p className="text-[11px] text-slate-400">All systems running smoothly</p>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 space-y-6 overflow-y-auto">
                    {/* Card 1: Cross-Video Intelligence */}
                    <div id="intelligence-box">
                        <GlobalMemoryChat />
                    </div>

                    {/* Card 2: 4 Telemetry Metric Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            icon={Video}
                            label="Videos Ingested"
                            value={videos.length}
                            sub="Analyzed streams"
                            color="blue"
                        />
                        <StatCard
                            icon={Activity}
                            label="Total Events"
                            value={totalEvents}
                            sub="CV tracklets classified"
                            color="emerald"
                        />
                        <StatCard
                            icon={Shield}
                            label="Total Alerts"
                            value={totalAlerts}
                            sub="Threat windows flagged"
                            color="orange"
                        />
                        <StatCard
                            icon={Cpu}
                            label="Compute Time"
                            value={`${totalTime.toFixed(0)}s`}
                            sub="GPU inference active"
                            color="purple"
                        />
                    </div>

                    {/* Card 3: Surveillance Feeds & Archives */}
                    <div id="feeds-section" className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Search className="w-4 h-4 text-blue-600" />
                                <h2 className="text-sm font-bold text-slate-900">Surveillance Feeds & Archives</h2>
                            </div>
                            {videos.length > 0 && (
                                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                                    {videos.length} video{videos.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>

                        {loading ? (
                            <div className="bg-white rounded-2xl p-16 border border-slate-200/80 shadow-xs flex flex-col items-center justify-center gap-3">
                                <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
                                <p className="text-xs text-slate-400">Loading footage records...</p>
                            </div>
                        ) : videos.length === 0 ? (
                            /* Empty State Matching Reference Image */
                            <div className="bg-white rounded-2xl p-12 sm:p-16 border border-slate-200/80 shadow-xs text-center">
                                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                                    <Video className="w-7 h-7 text-blue-600 stroke-[1.8]" />
                                </div>
                                <h3 className="text-base font-bold text-slate-900 mb-1.5">
                                    No surveillance footage ingested
                                </h3>
                                <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                                    Upload CCTV, drone, or security camera footage to trigger <span className="text-blue-600 font-semibold">YOLOv8</span> motion tracking, <span className="text-slate-700 font-medium">Gemini multimodal forensic analysis</span>, and RAG search.
                                </p>
                                <button
                                    onClick={() => setShowUpload(true)}
                                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-xs active:scale-95 transition-all"
                                >
                                    Upload your first video
                                </button>
                                <p className="text-xs text-slate-400 mt-4">
                                    Supports MP4, MOV · Max file size 5GB
                                </p>
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
            </div>

            {showUpload && (
                <UploadModal
                    onClose={() => setShowUpload(false)}
                    onDone={() => { setShowUpload(false); loadVideos() }}
                />
            )}
        </div>
    )
}

// ─── SidebarItem ──────────────────────────────────────────────────────────────

function SidebarItem({ icon: Icon, label, active, onClick }: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    active?: boolean
    onClick?: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={`cursor-pointer w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all text-left ${
                active
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
        >
            <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>{label}</span>
        </button>
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
        'High-risk incidents?',
        'Fights or assaults?',
        'Shoplifting events?',
        'Trespassing or unauthorized access?',
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
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-blue-200/90 bg-white flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
                    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="8" strokeDasharray="3 3" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-900">
                        Cross-Video Intelligence
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Correlate patterns, incidents, and suspicious individuals across all surveillance cameras and archives.
                    </p>
                </div>
            </div>

            {/* Search Input Bar */}
            <div className="border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-3 bg-white shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && ask(query)}
                    placeholder='Ask anything across all camera feeds, e.g. "Were there any prowlers or thefts?"'
                    className="flex-1 text-sm text-slate-800 placeholder-slate-400 outline-none bg-transparent"
                />
                <button
                    onClick={() => ask(query)}
                    disabled={loading || !query.trim()}
                    className="cursor-pointer shrink-0 w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-xs transition-all active:scale-95"
                    title="Send Query"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Send className="w-3.5 h-3.5 text-white" />}
                </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                {SUGGESTIONS.map(s => (
                    <button
                        key={s}
                        onClick={() => ask(s)}
                        className="cursor-pointer flex items-center gap-1.5 text-xs text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs transition-all hover:border-slate-300"
                    >
                        <Search className="w-3 h-3 text-slate-400" />
                        <span>{s}</span>
                    </button>
                ))}
                <button
                    onClick={() => { setQuery(''); setResult(null); inputRef.current?.focus() }}
                    className="cursor-pointer ml-auto text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Clear query"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>

            {error && (
                <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 px-3.5 py-2.5 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{error}</span>
                </div>
            )}

            {/* Search Results */}
            {result && !loading && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 animate-fade-up">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <Brain className="w-3.5 h-3.5 text-blue-600" />
                            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">AI Forensic Correlation</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {result.configured
                                ? result.answer
                                : 'Supermemory is not configured. Add SUPERMEMORY_API_KEY to backend/.env to persist cross-video memories.'}
                        </p>
                    </div>

                    {result.memories && result.memories.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                                Matched Video Records ({result.memories.length})
                            </p>
                            {result.memories.slice(0, 3).map((m, i) => (
                                <div key={i} className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
                                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{m.content?.slice(0, 250)}...</p>
                                    {m.score != null && (
                                        <span className="text-[10px] text-blue-600 font-medium mt-1 inline-block">
                                            Relevance: {(m.score * 100).toFixed(0)}%
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color }: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: string | number
    sub: string
    color: 'blue' | 'emerald' | 'orange' | 'purple'
}) {
    const colorStyles = {
        blue:    { bg: 'bg-blue-50',    border: 'border-blue-100',    icon: 'text-blue-600' },
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', icon: 'text-emerald-600' },
        orange:  { bg: 'bg-orange-50',  border: 'border-orange-100',  icon: 'text-orange-600' },
        purple:  { bg: 'bg-purple-50',  border: 'border-purple-100',  icon: 'text-purple-600' },
    }
    const c = colorStyles[color]

    return (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${c.icon}`} />
                </div>
                <span className="text-xs font-semibold text-slate-800">{label}</span>
            </div>
            <div className="mt-3">
                <p className="text-3xl font-bold text-slate-900 tracking-tight font-sans">{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
            </div>
        </div>
    )
}

// ─── VideoCard ────────────────────────────────────────────────────────────────

function VideoCard({ video: v, index, onClick }: { video: VideoInfo; index: number; onClick: () => void }) {
    const alertLevel = v.total_alerts > 5 ? 'high' : v.total_alerts > 0 ? 'medium' : 'none'

    return (
        <button
            onClick={onClick}
            className="cursor-pointer group w-full text-left bg-white hover:bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 sm:p-5 shadow-xs transition-all animate-fade-up"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                        <Video className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                            {v.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-sans">
                            <span>{(v.duration_s / 60).toFixed(1)} min</span>
                            <span>·</span>
                            <span>{v.total_events} event{v.total_events !== 1 ? 's' : ''}</span>
                            {v.subclips != null && v.subclips > 0 && (
                                <>
                                    <span>·</span>
                                    <span>{v.subclips} subclips</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                    {v.total_alerts > 0 ? (
                        <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border font-medium ${
                            alertLevel === 'high'
                                ? 'bg-red-50 text-red-600 border-red-200'
                                : 'bg-orange-50 text-orange-600 border-orange-200'
                        }`}>
                            <Shield className="w-3.5 h-3.5" />
                            <span>{v.total_alerts} alert{v.total_alerts !== 1 ? 's' : ''}</span>
                        </span>
                    ) : (
                        <span className="hidden sm:inline-flex items-center text-xs px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-200 font-medium">
                            Normal
                        </span>
                    )}

                    {v.gpu && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200">
                            {v.gpu}
                        </span>
                    )}

                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
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
            setProcessingStatus('Processing video motion tracking...')
            const poll = setInterval(async () => {
                try {
                    const status = await api.uploadStatus(res.video_id)
                    setProcessingStatus(
                        status.status === 'uploading'  ? 'Uploading to processing server...' :
                        status.status === 'processing' ? `Analyzing video subclips... ${status.progress}%` :
                        status.status === 'analyzing'  ? 'Gemini 3.5 forensic synthesis in progress...' :
                        status.status === 'done'       ? 'Analysis complete!' :
                        status.status === 'error'      ? `Error: ${status.error}` : 'Queued...'
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
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
            <div className="relative bg-white rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-xl border border-slate-200 animate-fade-up">
                <button
                    onClick={onClose}
                    className="cursor-pointer absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                        <Upload className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Upload Video</h3>
                </div>
                <p className="text-xs text-slate-400 mb-5 ml-10.5">MP4, AVI, MOV — Up to 5GB</p>

                {done ? (
                    <div className="text-center py-10 animate-fade-up">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                        </div>
                        <p className="text-sm text-emerald-600 font-semibold">Video Processed Successfully!</p>
                        <p className="text-xs text-slate-400 mt-1">Opening surveillance workspace...</p>
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
                                    ? 'border-blue-500 bg-blue-50/50 scale-[1.01]'
                                    : file
                                        ? 'border-emerald-300 bg-emerald-50/50'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
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
                                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-2 border border-emerald-200">
                                        <Video className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <p className="text-sm text-slate-800 font-medium truncate max-w-xs mx-auto">{file.name}</p>
                                    <p className="text-xs text-slate-400 mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB ready to analyze</p>
                                </div>
                            ) : (
                                <div>
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                                        <Upload className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <p className="text-sm text-slate-700 font-medium">Drag & drop video or click to browse</p>
                                    <p className="text-xs text-slate-400 mt-1">YOLO11 motion segmentation + Gemini multimodal</p>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="mt-3.5 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 px-3.5 py-2.5 rounded-xl animate-fade-up">
                                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                                <span>{error}</span>
                            </div>
                        )}

                        {uploading && (
                            <div className="mt-4 animate-fade-up space-y-2">
                                <div className="flex items-center justify-between text-xs text-slate-600">
                                    <span className="truncate max-w-[280px]">{processingStatus || `Uploading... ${uploadProgress}%`}</span>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 shrink-0" />
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                        style={{ width: `${processingStatus ? 100 : uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {!uploading && (
                            <button
                                onClick={handleUpload}
                                disabled={!file}
                                className="cursor-pointer mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-sm font-medium transition-all shadow-xs active:scale-[0.98] disabled:cursor-not-allowed"
                            >
                                Analyze Video
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
