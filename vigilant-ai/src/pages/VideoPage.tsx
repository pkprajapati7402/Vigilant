import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft, Shield, Clock, Users, Zap, Send, Search, Loader2,
    AlertTriangle, ChevronDown, ChevronUp, Activity, Eye, BarChart3,
    Tag, Brain, Cpu, Server, Download, Globe, FileText
} from 'lucide-react'
import { api, ev, type EventData, type VideoSummary, type InsightsData, type VideoInfo } from '../api'

function fmt(s: number) { const m = Math.floor(s / 60); return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}` }

function stageColor(s: string) {
    if (s === 'C') return 'bg-red-500/15 text-red-400 border-red-500/40'
    if (s === 'B') return 'bg-orange-500/15 text-orange-400 border-orange-500/40'
    if (s === 'A') return 'bg-amber-500/15 text-amber-400 border-amber-500/40'
    return 'bg-zinc-800 text-zinc-400 border-white/10'
}
function stageGlow(s: string) {
    if (s === 'C') return 'shadow-lg shadow-red-500/20 animate-pulse-ring'
    if (s === 'B') return 'shadow-md shadow-orange-500/10'
    return ''
}
function labelColor(l: string) {
    if (l.includes('altercation') || l.includes('weapon') || l.includes('assault')) return 'text-red-400'
    if (l.includes('confrontation') || l.includes('aggressive') || l.includes('fight')) return 'text-orange-400'
    if (l.includes('trespassing') || l.includes('shoplifting') || l.includes('theft') || l.includes('steal') || l.includes('creep')) return 'text-amber-400'
    return 'text-zinc-200'
}
function riskBadge(r: string) {
    if (r === 'high')   return 'bg-red-500/15 text-red-400 border-red-500/40 glow-red'
    if (r === 'medium') return 'bg-amber-500/15 text-amber-400 border-amber-500/40 glow-amber'
    return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 glow-emerald'
}
function riskAccent(r: string) {
    if (r === 'high')   return '#ef4444'
    if (r === 'medium') return '#f59e0b'
    return '#10b981'
}

export default function VideoPage() {
    const { videoId } = useParams<{ videoId: string }>()
    const navigate = useNavigate()
    const [alerts, setAlerts]       = useState<EventData[]>([])
    const [events, setEvents]       = useState<EventData[]>([])
    const [summary, setSummary]     = useState<VideoSummary | null>(null)
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
    const [loading, setLoading]     = useState(true)
    const [tab, setTab]             = useState<'chat' | 'alerts' | 'events' | 'insights' | 'memory'>('chat')
    const [reportLoading, setReportLoading] = useState(false)
    const [pdfLoading, setPdfLoading] = useState(false)

    useEffect(() => {
        if (!videoId) return
        Promise.all([
            api.videoAlerts(videoId).then(d => setAlerts(d.alerts || [])),
            api.videoEvents(videoId).then(d => setEvents(d.events || [])),
            api.videoSummary(videoId).then(d => { if (d && 'summary' in d && d.summary) setSummary(d as VideoSummary) }),
            api.videoInfo(videoId).then(setVideoInfo).catch(() => null),
        ])
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [videoId])

    if (!videoId) return null
    const videoName = events[0]?.video_source || alerts[0]?.video_source || videoId

    return (
        <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
            {/* Tactical Grid & Ambient glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden bg-tactical-grid opacity-30" />
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />
                {summary?.risk_level === 'high' ? (
                    <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-3xl" />
                ) : (
                    <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl" />
                )}
            </div>

            {/* Header */}
            <header className="sticky top-0 z-30 bg-[#080c14]/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-2xl shadow-black/40">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                            onClick={() => navigate('/')}
                            className="cursor-pointer p-2 hover:bg-zinc-800/80 rounded-xl transition-all text-zinc-400 hover:text-white border border-white/5 hover:border-white/15"
                            title="Back to feeds"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div className="relative w-8 h-8 shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg blur-sm opacity-50" />
                            <div className="relative w-8 h-8 bg-gradient-to-br from-[#121826] to-[#1c2438] border border-amber-500/40 rounded-lg flex items-center justify-center">
                                <Eye className="w-4 h-4 text-amber-400" />
                            </div>
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-sm font-bold truncate text-white tracking-tight">{videoName}</h1>
                            <p className="text-[10px] text-zinc-400 font-mono">
                                {events.length} event{events.length !== 1 ? 's' : ''} · {alerts.length} threat alert{alerts.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {alerts.length > 0 && (
                            <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border font-mono font-semibold ${
                                alerts.some(a => a.alert?.stage === 'C')
                                    ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse-ring'
                                    : 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                            }`}>
                                <Shield className="w-3.5 h-3.5" />
                                <span>{alerts.length} Alert{alerts.length !== 1 ? 's' : ''}</span>
                            </span>
                        )}

                        <button
                            title="Download TXT report"
                            disabled={reportLoading || events.length === 0}
                            onClick={async () => {
                                setReportLoading(true)
                                try {
                                    const res = await fetch(api.videoReportTextUrl(videoId))
                                    if (!res.ok) throw new Error(`HTTP ${res.status}`)
                                    const blob = await res.blob()
                                    const blobUrl = URL.createObjectURL(blob)
                                    const a = document.createElement('a')
                                    a.href = blobUrl; a.download = `report_${videoId}.txt`
                                    document.body.appendChild(a); a.click(); document.body.removeChild(a)
                                    URL.revokeObjectURL(blobUrl)
                                } finally { setReportLoading(false) }
                            }}
                            className="cursor-pointer shrink-0 flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono font-medium text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-white/20 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            {reportLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" /> : <FileText className="w-3.5 h-3.5 text-zinc-400" />}
                            <span>TXT</span>
                        </button>

                        <button
                            title="Download PDF report"
                            disabled={pdfLoading || events.length === 0}
                            onClick={async () => {
                                setPdfLoading(true)
                                try {
                                    const res = await fetch(api.videoReportPdfUrl(videoId))
                                    if (!res.ok) throw new Error(`HTTP ${res.status}`)
                                    const blob = await res.blob()
                                    const blobUrl = URL.createObjectURL(blob)
                                    const a = document.createElement('a')
                                    a.href = blobUrl; a.download = `report_${videoId}.pdf`
                                    document.body.appendChild(a); a.click(); document.body.removeChild(a)
                                    URL.revokeObjectURL(blobUrl)
                                } finally { setPdfLoading(false) }
                            }}
                            className="cursor-pointer shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                        >
                            {pdfLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                            <span>PDF</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* AI Summary Hero Card */}
            {summary && (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 w-full animate-fade-up">
                    <div
                        className="glass-panel rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden border border-white/10"
                        style={{ borderLeft: `4px solid ${riskAccent(summary.risk_level)}` }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Brain className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">AI Forensic Analysis</span>
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-mono font-bold ml-auto ${riskBadge(summary.risk_level)}`}>
                                {summary.risk_level.toUpperCase()} RISK
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed mb-4 whitespace-pre-line">{summary.summary}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {summary.intent.map(i => (
                                <span key={i} className="text-[11px] px-2.5 py-0.5 bg-violet-500/15 text-violet-300 rounded-lg border border-violet-500/30 font-mono font-medium">
                                    {i.replace(/_/g, ' ')}
                                </span>
                            ))}
                            {summary.tags.slice(0, 5).map(t => (
                                <span key={t} className="text-[11px] px-2 py-0.5 bg-zinc-900/80 text-zinc-400 rounded-lg border border-white/10 font-mono">
                                    #{t}
                                </span>
                            ))}
                        </div>

                        {summary.key_moments.length > 0 && (
                            <div className="mt-4 border-t border-white/[0.08] pt-3.5">
                                <p className="text-[10px] text-zinc-400 font-mono font-semibold uppercase tracking-wider mb-3">Key Surveillance Moments</p>
                                <div className="relative pl-5">
                                    <div className="absolute left-1.5 top-1 bottom-1 w-px bg-gradient-to-b from-amber-400 via-orange-500/40 to-transparent" />
                                    <div className="space-y-3">
                                        {summary.key_moments.map((km, i) => (
                                            <div key={i} className="flex items-start gap-3 relative">
                                                <div className="absolute -left-[15px] top-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-[#0d121e] shrink-0 shadow-sm shadow-amber-400/50" />
                                                <span className="text-amber-400 font-mono text-xs shrink-0 pt-px font-semibold">{km.time}</span>
                                                <span className="text-zinc-300 text-xs leading-relaxed">{km.description}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Processing Stats chips */}
            {videoInfo && ((videoInfo.chunks ?? 0) > 0 || (videoInfo.gpu_time_s ?? 0) > 0) && (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-3 w-full">
                    <div className="flex flex-wrap gap-2">
                        {videoInfo.gpu && <StatChip icon={<Server className="w-3 h-3" />} label={videoInfo.gpu} color="violet" />}
                        {(videoInfo.chunks ?? 0) > 0 && <StatChip icon={<Cpu className="w-3 h-3" />} label={`${videoInfo.chunks} chunks · ${videoInfo.subclips} subclips`} color="gray" />}
                        {(videoInfo.cpu_time_s ?? 0) > 0 && <StatChip icon={null} label={`CPU ${videoInfo.cpu_time_s?.toFixed(0)}s`} color="gray" />}
                        {(videoInfo.gpu_time_s ?? 0) > 0 && <StatChip icon={<Zap className="w-3 h-3" />} label={`GPU ${videoInfo.gpu_time_s?.toFixed(0)}s`} color="violet" />}
                        {(videoInfo.processing_time_s ?? 0) > 0 && <StatChip icon={<Clock className="w-3 h-3" />} label={`Total ${videoInfo.processing_time_s?.toFixed(0)}s`} color="gray" />}
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="border-b border-white/[0.08] bg-[#080c14]/90 backdrop-blur-xl sticky top-[57px] z-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1">
                    {(['chat', 'alerts', 'events', 'insights', 'memory'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`cursor-pointer px-4 py-3 text-xs font-mono font-semibold transition-all border-b-2 capitalize tracking-wide ${
                                tab === t
                                    ? 'text-amber-400 border-amber-400 bg-amber-500/10'
                                    : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:border-zinc-700'
                            }`}
                        >
                            {t === 'alerts'   ? `Alerts (${alerts.length})` :
                             t === 'events'   ? `Events (${events.length})` :
                             t === 'insights' ? 'Insights' :
                             t === 'memory'   ? 'Memory' : 'Chat & Search'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-hidden relative z-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
                        <p className="text-xs text-zinc-400 font-mono">Loading surveillance analysis...</p>
                    </div>
                ) : tab === 'chat' ? (
                    <ChatPanel videoId={videoId} />
                ) : tab === 'alerts' ? (
                    <CardList items={alerts} emptyIcon={Shield} emptyText="No threat alerts detected" />
                ) : tab === 'insights' ? (
                    <InsightsPanel videoId={videoId} />
                ) : tab === 'memory' ? (
                    <MemoryPanel videoId={videoId} />
                ) : (
                    <CardList items={events} emptyIcon={Activity} emptyText="No movement events detected" />
                )}
            </div>
        </div>
    )
}

function StatChip({ icon, label, color }: {
    icon: React.ReactNode
    label: string
    color: 'violet' | 'gray'
}) {
    const cls = color === 'violet'
        ? 'bg-violet-500/10 text-violet-300 border-violet-500/25'
        : 'bg-zinc-900/80 text-zinc-300 border-white/10'
    return (
        <span className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border font-mono font-medium ${cls}`}>
            {icon}
            <span>{label}</span>
        </span>
    )
}

// ─── CardList (Events & Alerts) ──────────────────────────────────────────────

function CardList({ items, emptyIcon: Icon, emptyText }: {
    items: EventData[]
    emptyIcon: React.ComponentType<{ className?: string }>
    emptyText: string
}) {
    const [expanded, setExpanded] = useState<string | null>(null)

    if (items.length === 0) return (
        <div className="text-center py-24 text-zinc-500">
            <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                <Icon className="w-7 h-7 opacity-40" />
            </div>
            <p className="text-sm font-mono">{emptyText}</p>
        </div>
    )

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-3">
            {items.map((raw, idx) => {
                const e = ev(raw)
                const isOpen = expanded === e.clipId
                const isStageC = e.alertStage === 'C'

                return (
                    <button
                        key={e.clipId}
                        onClick={() => setExpanded(isOpen ? null : e.clipId)}
                        className={`cursor-pointer w-full text-left glass-card rounded-2xl p-4 sm:p-5 transition-all animate-fade-up border ${
                            isStageC
                                ? 'border-red-500/40 hover:border-red-500/70 glow-red'
                                : 'border-white/[0.08] hover:border-white/20'
                        } ${stageGlow(e.alertStage)}`}
                        style={{ animationDelay: `${idx * 25}ms` }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5 min-w-0">
                                {e.alertStage !== 'none' && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-md border font-mono font-bold shrink-0 ${stageColor(e.alertStage)}`}>
                                        STAGE {e.alertStage}
                                    </span>
                                )}
                                <span className={`text-sm font-bold truncate ${labelColor(e.label)}`}>
                                    {e.label.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                {e.alertScore > 0 && (
                                    <span className={`text-xs font-mono font-bold ${
                                        e.alertScore > 0.7 ? 'text-red-400' : e.alertScore > 0.4 ? 'text-orange-400' : 'text-zinc-400'
                                    }`}>
                                        score {e.alertScore.toFixed(2)}
                                    </span>
                                )}
                                <span className="text-xs font-mono text-zinc-400">{fmt(e.start)}–{fmt(e.end)}</span>
                                {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                            </div>
                        </div>

                        {e.caption && (
                            <p className="text-xs text-zinc-300 mt-2 leading-relaxed line-clamp-2">{e.caption}</p>
                        )}

                        {isOpen && (
                            <div className="mt-4 pt-3.5 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono animate-fade-in">
                                <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-zinc-500 block">PEOPLE DETECTED</span>
                                    <span className="text-sm font-bold text-zinc-200">{e.people}</span>
                                </div>
                                <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-zinc-500 block">PEAK MOTION</span>
                                    <span className="text-sm font-bold text-zinc-200">{(e.peakMotion * 100).toFixed(0)}%</span>
                                </div>
                                <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-zinc-500 block">CONFIDENCE</span>
                                    <span className="text-sm font-bold text-zinc-200">{(e.confidence * 100).toFixed(0)}%</span>
                                </div>
                                <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-zinc-500 block">DURATION</span>
                                    <span className="text-sm font-bold text-zinc-200">{e.duration.toFixed(1)}s</span>
                                </div>
                            </div>
                        )}
                    </button>
                )
            })}
        </div>
    )
}

// ─── ChatPanel ────────────────────────────────────────────────────────────────

interface LocalMsg {
    id: string
    role: 'user' | 'assistant'
    text: string
    results?: EventData[]
    loading?: boolean
    streaming?: boolean
}

function ChatPanel({ videoId }: { videoId: string }) {
    const [messages, setMessages] = useState<LocalMsg[]>([])
    const [input, setInput]       = useState('')
    const [searching, setSearching] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        api.chatHistory(videoId).then(data => {
            if (data.messages.length > 0) {
                setMessages(data.messages.map((m, i) => ({
                    id: `h-${m.id || i}`, role: m.role, text: m.content,
                })))
            } else {
                setMessages([{
                    id: 'init', role: 'assistant',
                    text: 'Ask me anything about this video. I\'ll inspect the footage and give you specific answers with timestamps.\n\nTry: "What happened?", "Any theft or fighting?", "Who was involved?"',
                }])
            }
        }).catch(() => {
            setMessages([{ id: 'init', role: 'assistant', text: 'Ask me anything about this video.' }])
        })
    }, [videoId])

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

    const handleSend = async () => {
        const q = input.trim()
        if (!q || searching) return

        const userMsg: LocalMsg = { id: `u-${Date.now()}`, role: 'user', text: q }
        const loadId = `a-${Date.now()}`
        setMessages(prev => [...prev, userMsg, { id: loadId, role: 'assistant', text: '', loading: true }])
        setInput('')
        setSearching(true)

        try {
            const stream = api.chatStream(q, videoId, 8,
                (_count, results) => {
                    setMessages(prev => prev.map(m => m.id === loadId
                        ? { ...m, loading: false, streaming: true, results, text: m.text }
                        : m
                    ))
                }
            )
            const reader = stream.getReader()
            let fullText = ''
            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                fullText += value
                setMessages(prev => prev.map(m => m.id === loadId
                    ? { ...m, loading: false, streaming: true, text: fullText }
                    : m
                ))
            }
            setMessages(prev => prev.map(m => m.id === loadId
                ? { ...m, streaming: false, text: fullText || 'No clear answer found.' }
                : m
            ))
        } catch {
            setMessages(prev => prev.map(m => m.id === loadId
                ? { ...m, loading: false, streaming: false, text: 'Search query failed. Please verify backend connection.' }
                : m
            ))
        } finally {
            setSearching(false)
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-220px)] bg-[#080c14] relative">
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto py-6">
                <div className="max-w-3xl mx-auto px-4 space-y-6">
                    {messages.map((msg) => (
                        msg.role === 'user' ? (
                            /* User message bubble */
                            <div key={msg.id} className="flex justify-end animate-fade-up">
                                <div className="max-w-[80%] bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl rounded-br-sm px-4.5 py-3 shadow-lg shadow-amber-500/20">
                                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                                </div>
                            </div>
                        ) : (
                            /* AI message */
                            <div key={msg.id} className="flex gap-3.5 animate-fade-up">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 border border-violet-400/30 flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-violet-500/20">
                                    <Brain className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    {msg.loading ? (
                                        <div className="flex items-center gap-2 pt-2">
                                            <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '160ms' }} />
                                            <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '320ms' }} />
                                        </div>
                                    ) : (
                                        <div className="glass-panel rounded-2xl p-4.5 border border-white/10 shadow-lg">
                                            <p className="text-xs sm:text-sm text-zinc-100 leading-relaxed whitespace-pre-wrap">
                                                {msg.text}
                                                {msg.streaming && (
                                                    <span className="inline-block w-1.5 h-4 bg-amber-400 ml-1 animate-blink-cursor align-middle" />
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    {/* Matching clips */}
                                    {msg.results && msg.results.length > 0 && (
                                        <div className="mt-3.5 space-y-2.5 animate-fade-up">
                                            <p className="text-[10px] text-zinc-400 font-mono font-semibold uppercase tracking-wider px-1">
                                                {msg.results.length} Evidence Clip{msg.results.length !== 1 ? 's' : ''} Identified
                                            </p>
                                            {msg.results.slice(0, 5).map((raw, i) => {
                                                const e = ev(raw)
                                                return (
                                                    <div
                                                        key={e.clipId || i}
                                                        className="glass-card rounded-xl p-3 text-xs shadow-md border border-white/[0.08] hover:border-amber-400/40 transition-colors animate-fade-up"
                                                        style={{ animationDelay: `${i * 50}ms` }}
                                                    >
                                                        <div className="flex items-center gap-2.5 font-mono">
                                                            <span className="text-zinc-500 font-semibold">#{i + 1}</span>
                                                            <span className={`font-bold ${labelColor(e.label)}`}>
                                                                {e.label.replace(/_/g, ' ')}
                                                            </span>
                                                            {e.alertStage !== 'none' && (
                                                                <span className={`text-[9px] px-1.5 py-0.5 rounded-md border font-bold ${stageColor(e.alertStage)}`}>
                                                                    STAGE {e.alertStage}
                                                                </span>
                                                            )}
                                                            <span className="text-amber-400 ml-auto font-semibold">{fmt(e.start)}–{fmt(e.end)}</span>
                                                        </div>
                                                        {e.caption && (
                                                            <p className="text-zinc-300 mt-1.5 line-clamp-2 leading-relaxed text-[11px]">{e.caption}</p>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    ))}
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Input bar */}
            <div className="bg-[#080c14]/95 border-t border-white/[0.08] px-4 py-4 backdrop-blur-xl">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-zinc-950/80 border border-white/10 rounded-2xl shadow-inner focus-within:border-amber-500/50 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
                        <div className="flex items-center gap-3 px-4 py-3">
                            <Search className="w-4 h-4 text-zinc-500 shrink-0" />
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder="Ask questions about this video footage (e.g. 'what did the person do?')..."
                                disabled={searching}
                                className="flex-1 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none bg-transparent disabled:opacity-50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={searching || !input.trim()}
                                className="cursor-pointer shrink-0 p-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white rounded-xl transition-all active:scale-95 disabled:cursor-not-allowed shadow-md"
                            >
                                {searching
                                    ? <Loader2 className="w-4 h-4 text-white animate-spin" />
                                    : <Send className="w-4 h-4 text-white" />
                                }
                            </button>
                        </div>
                    </div>
                    <p className="text-center text-[10px] text-zinc-500 font-mono mt-2">
                        CLIP semantic search · Gemini 3.5 forensic streaming
                    </p>
                </div>
            </div>
        </div>
    )
}

// ─── MemoryPanel ──────────────────────────────────────────────────────────────

function MemoryPanel({ videoId }: { videoId: string }) {
    const [query, setQuery]   = useState('')
    const [loading, setLoading] = useState(false)
    const [scoped, setScoped] = useState(false)
    const [result, setResult] = useState<{ answer: string; memories: Array<{ content: string; score: number; metadata: Record<string, unknown> }>; configured: boolean } | null>(null)
    const [error, setError]   = useState<string | null>(null)

    const handleQuery = async () => {
        const q = query.trim()
        if (!q || loading) return
        setLoading(true); setError(null); setResult(null)
        try {
            setResult(await api.queryMemory(q, scoped ? videoId : undefined))
        } catch (e) {
            setError(String(e))
        } finally {
            setLoading(false)
        }
    }

    const suggestions = [
        'Any prior incidents involving theft?',
        'Have similar intruders been detected before?',
        'Show all high-risk incidents',
        'Unauthorized movement at night?',
    ]

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">
            <div className="glass-panel rounded-2xl p-4.5 flex gap-3.5 border border-white/10 shadow-lg">
                <Globe className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-bold text-white mb-0.5">Cross-Video Surveillance Intelligence</p>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                        Query persistent memory across <span className="text-zinc-200 font-semibold">all</span> ingested surveillance streams to spot repeat suspects and security threats.
                    </p>
                </div>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg space-y-3.5">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono font-semibold">Memory Query</p>
                    <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={scoped}
                            onChange={e => setScoped(e.target.checked)}
                            className="w-3.5 h-3.5 accent-amber-500 rounded bg-zinc-900 border-white/20"
                        />
                        <span>Scope to this video only</span>
                    </label>
                </div>

                <div className="bg-zinc-950/80 border border-white/10 rounded-xl shadow-inner focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <Search className="w-4 h-4 text-zinc-500 shrink-0" />
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleQuery()}
                            placeholder="e.g. Has this person or similar prowler been observed before?"
                            className="flex-1 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none bg-transparent"
                        />
                        <button
                            onClick={handleQuery}
                            disabled={loading || !query.trim()}
                            className="cursor-pointer shrink-0 p-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-zinc-800 disabled:to-zinc-800 text-white rounded-lg transition-all active:scale-95 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Search className="w-4 h-4 text-white" />}
                        </button>
                    </div>
                </div>

                {!result && !loading && (
                    <div className="flex flex-wrap gap-2 pt-1">
                        {suggestions.map(s => (
                            <button
                                key={s}
                                onClick={() => setQuery(s)}
                                className="cursor-pointer text-[11px] px-2.5 py-1 bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-white/[0.08] rounded-lg transition-all"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {loading && (
                <div className="flex items-center justify-center gap-2.5 py-8 text-zinc-400 text-xs font-mono">
                    <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                    <span>Searching cross-stream surveillance memories...</span>
                </div>
            )}
            {error && <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-4 text-xs text-red-400">{error}</div>}
            {result && !result.configured && (
                <div className="glass-card rounded-2xl p-6 text-center space-y-2 border border-white/10 shadow-lg">
                    <Globe className="w-8 h-8 text-zinc-500 mx-auto" />
                    <p className="text-sm text-zinc-300 font-semibold">Supermemory API key not configured</p>
                    <p className="text-xs text-zinc-400 font-mono">Set <code className="bg-zinc-900 px-2 py-0.5 rounded text-amber-300 border border-white/10">SUPERMEMORY_API_KEY</code> in backend/.env</p>
                </div>
            )}
            {result && result.configured && (
                <div className="space-y-3.5 animate-fade-up">
                    <div className="glass-panel rounded-2xl p-5 border border-violet-500/30 shadow-lg" style={{ borderLeft: '4px solid #8b5cf6' }}>
                        <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-4 h-4 text-violet-400" />
                            <span className="text-[10px] text-violet-300 uppercase font-mono tracking-wider font-semibold">Intelligence Synthesis</span>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">{result.answer}</p>
                    </div>
                    {result.memories.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono font-semibold px-1">
                                {result.memories.length} Matched Surveillance Record{result.memories.length !== 1 ? 's' : ''}
                            </p>
                            {result.memories.map((mem, i) => (
                                <div key={i} className="glass-card rounded-xl p-3.5 shadow-md border border-white/[0.08]" style={{ animationDelay: `${i * 60}ms` }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-1.5">
                                            <FileText className="w-3.5 h-3.5 text-zinc-500" />
                                            <span className="text-[10px] text-zinc-400 font-mono font-semibold">Record #{i + 1}</span>
                                        </div>
                                        {mem.score > 0 && <span className="text-[10px] text-violet-400 font-mono font-semibold">score {mem.score.toFixed(3)}</span>}
                                    </div>
                                    <p className="text-xs text-zinc-300 leading-relaxed line-clamp-4 whitespace-pre-line">
                                        {mem.content.slice(0, 400)}{mem.content.length > 400 && '…'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ─── InsightsPanel ────────────────────────────────────────────────────────────

function InsightsPanel({ videoId }: { videoId: string }) {
    const [data, setData]       = useState<InsightsData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.videoInsights(videoId).then(setData).catch(console.error).finally(() => setLoading(false))
    }, [videoId])

    if (loading) return (
        <div className="flex justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
        </div>
    )
    if (!data) return (
        <div className="text-center py-24 text-zinc-500">
            <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                <BarChart3 className="w-7 h-7 opacity-40" />
            </div>
            <p className="text-sm font-mono">No telemetry insights available</p>
        </div>
    )

    const maxTypeCount = Math.max(...Object.values(data.event_types), 1)

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">
            {/* Stats bento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Total Events', value: data.total_events, icon: Activity, cls: 'border-indigo-500/30 text-indigo-300 glow-indigo' },
                    { label: 'Threat Alerts', value: data.total_alerts, icon: AlertTriangle, cls: 'border-red-500/30 text-red-400 glow-red' },
                    { label: 'Event Types', value: Object.keys(data.event_types).length, icon: Tag, cls: 'border-violet-500/30 text-violet-300' },
                    { label: 'Max People', value: Math.max(...data.timeline.map(t => t.people), 0), icon: Users, cls: 'border-emerald-500/30 text-emerald-300 glow-emerald' },
                ].map(({ label, value, icon: Icon, cls }) => (
                    <div key={label} className={`glass-card rounded-2xl p-4 border animate-fade-up ${cls}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-3.5 h-3.5 opacity-80" />
                            <span className="text-[10px] text-zinc-400 uppercase font-mono font-semibold tracking-wider">{label}</span>
                        </div>
                        <div className="text-2xl font-bold font-mono">{value}</div>
                    </div>
                ))}
            </div>

            {/* Event distribution */}
            <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg">
                <h3 className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest mb-4">Classified Event Distribution</h3>
                <div className="space-y-3">
                    {Object.entries(data.event_types).sort((a, b) => b[1] - a[1]).map(([label, count]) => (
                        <div key={label} className="flex items-center gap-3">
                            <span className={`text-xs w-40 truncate font-semibold ${labelColor(label)}`}>{label.replace(/_/g, ' ')}</span>
                            <div className="flex-1 bg-zinc-900 rounded-full h-2.5 overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 rounded-full transition-all duration-700"
                                    style={{ width: `${(count / maxTypeCount) * 100}%` }}
                                />
                            </div>
                            <span className="text-xs text-zinc-400 w-8 text-right font-mono">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Alert severity */}
            <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg">
                <h3 className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest mb-4">Threat Alert Severity</h3>
                <div className="flex gap-3">
                    {(['C', 'B', 'A'] as const).map(stage => {
                        const count = data.alert_stages[stage] || 0
                        return (
                            <div key={stage} className={`flex-1 glass-card rounded-2xl p-4 border ${stageColor(stage)} ${count > 0 ? stageGlow(stage) : ''}`}>
                                <div className="text-2xl font-bold font-mono">{count}</div>
                                <div className="text-[11px] font-mono opacity-70 mt-1">Stage {stage} Threats</div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Activity Timeline */}
            <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg">
                <h3 className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest mb-3">Surveillance Activity Timeline</h3>
                <div className="relative h-20 bg-zinc-950 rounded-xl overflow-hidden border border-white/10">
                    {data.timeline.length > 0 && (() => {
                        const maxEnd = Math.max(...data.timeline.map(t => t.end), 1)
                        return data.timeline.map((t, i) => {
                            const left  = (t.start / maxEnd) * 100
                            const width = Math.max(((t.end - t.start) / maxEnd) * 100, 0.75)
                            const color = t.alert_stage === 'C' ? 'bg-red-500' :
                                          t.alert_stage === 'B' ? 'bg-orange-500' :
                                          t.alert_stage === 'A' ? 'bg-amber-400' : 'bg-indigo-500'
                            return (
                                <div key={i}
                                    title={`${fmt(t.start)}–${fmt(t.end)} | ${t.label}`}
                                    className={`absolute bottom-0 ${color} opacity-80 hover:opacity-100 cursor-pointer transition-opacity rounded-t`}
                                    style={{ left: `${left}%`, width: `${width}%`, height: `${Math.min(25 + t.people * 20, 100)}%` }}
                                />
                            )
                        })
                    })()}
                </div>
                <div className="flex justify-between text-[10px] font-mono text-zinc-400 mt-2 px-1">
                    <span>0:00</span>
                    <span>{fmt(Math.max(...data.timeline.map(t => t.end), 0))}</span>
                </div>
            </div>
        </div>
    )
}
