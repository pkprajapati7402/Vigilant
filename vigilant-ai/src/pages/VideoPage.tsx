import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { Flaticon } from '../components/Flaticon'
import { api, ev, type EventData, type VideoSummary, type InsightsData, type VideoInfo } from '../api'

function fmt(s: number) { const m = Math.floor(s / 60); return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}` }

function stageColor(s: string) {
    if (s === 'C') return 'bg-red-50 text-red-600 border-red-200'
    if (s === 'B') return 'bg-orange-50 text-orange-600 border-orange-200'
    if (s === 'A') return 'bg-amber-50 text-amber-700 border-amber-200'
    return 'bg-slate-100 text-slate-600 border-slate-200'
}
function stageGlow(s: string) {
    if (s === 'C') return 'shadow-sm animate-pulse-ring'
    if (s === 'B') return 'shadow-xs'
    return ''
}
function labelColor(l: string) {
    if (l.includes('altercation') || l.includes('weapon') || l.includes('assault')) return 'text-red-600'
    if (l.includes('confrontation') || l.includes('aggressive') || l.includes('fight')) return 'text-orange-600'
    if (l.includes('trespassing') || l.includes('shoplifting') || l.includes('theft') || l.includes('steal') || l.includes('creep')) return 'text-amber-700'
    return 'text-slate-800'
}
function riskBadge(r: string) {
    if (r === 'high')   return 'bg-red-50 text-red-600 border-red-200'
    if (r === 'medium') return 'bg-amber-50 text-amber-700 border-amber-200'
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
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
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                            onClick={() => navigate('/')}
                            className="cursor-pointer p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500 hover:text-slate-800 border border-slate-200 shadow-xs"
                            title="Back to dashboard"
                        >
                            <Flaticon name="angle-small-left" className="text-base" />
                        </button>
                        <div className="w-9 h-9 rounded-xl border border-blue-200 bg-white flex items-center justify-center text-blue-600 shadow-xs shrink-0">
                            <Flaticon name="shield-check" type="sr" className="text-blue-600 text-sm" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-sm sm:text-base font-bold truncate text-slate-900">{videoName}</h1>
                            <p className="text-xs text-slate-400">
                                {events.length} event{events.length !== 1 ? 's' : ''} · {alerts.length} threat alert{alerts.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                        {alerts.length > 0 && (
                            <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border font-medium ${
                                alerts.some(a => a.alert?.stage === 'C')
                                    ? 'bg-red-50 text-red-600 border-red-200 animate-pulse-ring'
                                    : 'bg-orange-50 text-orange-600 border-orange-200'
                            }`}>
                                <Flaticon name="shield-exclamation" type="sr" className="text-xs" />
                                <span>{alerts.length} alert{alerts.length !== 1 ? 's' : ''}</span>
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
                            className="cursor-pointer shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {reportLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" /> : <Flaticon name="document" className="text-slate-400 text-xs" />}
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
                            className="cursor-pointer shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 border border-blue-200 rounded-xl shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {pdfLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Flaticon name="cloud-download" className="text-blue-600 text-xs" />}
                            <span>PDF</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* AI Analysis Hero Card */}
            {summary && (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 w-full animate-fade-up">
                    <div
                        className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs relative overflow-hidden"
                        style={{ borderLeft: `4px solid ${riskAccent(summary.risk_level)}` }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Flaticon name="brain" type="sr" className="text-blue-600 text-sm" />
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">AI Forensic Analysis</span>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ml-auto ${riskBadge(summary.risk_level)}`}>
                                {summary.risk_level.toUpperCase()} RISK
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4 whitespace-pre-line">{summary.summary}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {summary.intent.map(i => (
                                <span key={i} className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 font-medium">
                                    {i.replace(/_/g, ' ')}
                                </span>
                            ))}
                            {summary.tags.slice(0, 5).map(t => (
                                <span key={t} className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200">
                                    #{t}
                                </span>
                            ))}
                        </div>

                        {summary.key_moments.length > 0 && (
                            <div className="mt-4 border-t border-slate-100 pt-3.5">
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Key Surveillance Moments</p>
                                <div className="relative pl-5">
                                    <div className="absolute left-1.5 top-1 bottom-1 w-px bg-slate-200" />
                                    <div className="space-y-3">
                                        {summary.key_moments.map((km, i) => (
                                             <div key={i} className="flex items-start gap-3 relative">
                                                <div className="absolute -left-[15px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white shrink-0 shadow-xs" />
                                                <span className="text-blue-600 font-mono text-xs shrink-0 pt-px font-semibold">{km.time}</span>
                                                <span className="text-slate-600 text-xs leading-relaxed">{km.description}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Processing Stats Chips */}
            {videoInfo && ((videoInfo.chunks ?? 0) > 0 || (videoInfo.gpu_time_s ?? 0) > 0) && (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-2 w-full">
                    <div className="flex flex-wrap gap-2">
                        {videoInfo.gpu && <StatChip icon={<Flaticon name="chip" type="sr" className="text-blue-600 text-xs" />} label={videoInfo.gpu} color="blue" />}
                        {(videoInfo.chunks ?? 0) > 0 && <StatChip icon={<Flaticon name="folder" className="text-slate-500 text-xs" />} label={`${videoInfo.chunks} chunks · ${videoInfo.subclips} subclips`} color="gray" />}
                        {(videoInfo.cpu_time_s ?? 0) > 0 && <StatChip icon={null} label={`CPU ${videoInfo.cpu_time_s?.toFixed(0)}s`} color="gray" />}
                        {(videoInfo.gpu_time_s ?? 0) > 0 && <StatChip icon={<Flaticon name="bolt" type="sr" className="text-blue-600 text-xs" />} label={`GPU ${videoInfo.gpu_time_s?.toFixed(0)}s`} color="blue" />}
                        {(videoInfo.processing_time_s ?? 0) > 0 && <StatChip icon={<Flaticon name="clock" className="text-slate-500 text-xs" />} label={`Total ${videoInfo.processing_time_s?.toFixed(0)}s`} color="gray" />}
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="border-b border-slate-200 bg-white sticky top-[57px] z-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1">
                    {(['chat', 'alerts', 'events', 'insights', 'memory'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`cursor-pointer px-4 py-3 text-xs sm:text-sm font-medium transition-all border-b-2 capitalize tracking-normal flex items-center gap-1.5 ${
                                tab === t
                                    ? 'text-blue-600 border-blue-600 font-semibold'
                                    : 'text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-300'
                            }`}
                        >
                            {t === 'chat'     && <Flaticon name="comment-alt" className="text-xs" />}
                            {t === 'alerts'   && <Flaticon name="bell" className="text-xs" />}
                            {t === 'events'   && <Flaticon name="pulse" className="text-xs" />}
                            {t === 'insights' && <Flaticon name="stats" className="text-xs" />}
                            {t === 'memory'   && <Flaticon name="brain" className="text-xs" />}
                            <span>
                                {t === 'alerts'   ? `Alerts (${alerts.length})` :
                                 t === 'events'   ? `Events (${events.length})` :
                                 t === 'insights' ? 'Insights' :
                                 t === 'memory'   ? 'Memory' : 'Chat & Search'}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-hidden relative z-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
                        <p className="text-xs text-slate-400">Loading analysis data...</p>
                    </div>
                ) : tab === 'chat' ? (
                    <ChatPanel videoId={videoId} />
                ) : tab === 'alerts' ? (
                    <CardList items={alerts} emptyIconName="bell" emptyText="No threat alerts detected" />
                ) : tab === 'insights' ? (
                    <InsightsPanel videoId={videoId} />
                ) : tab === 'memory' ? (
                    <MemoryPanel videoId={videoId} />
                ) : (
                    <CardList items={events} emptyIconName="pulse" emptyText="No movement events detected" />
                )}
            </div>
        </div>
    )
}

function StatChip({ icon, label, color }: {
    icon: React.ReactNode
    label: string
    color: 'blue' | 'gray'
}) {
    const cls = color === 'blue'
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : 'bg-white text-slate-600 border-slate-200 shadow-xs'
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border font-medium ${cls}`}>
            {icon}
            <span>{label}</span>
        </span>
    )
}

// ─── CardList (Events & Alerts) ──────────────────────────────────────────────

function CardList({ items, emptyIconName, emptyText }: {
    items: EventData[]
    emptyIconName: string
    emptyText: string
}) {
    const [expanded, setExpanded] = useState<string | null>(null)

    if (items.length === 0) return (
        <div className="text-center py-24 text-slate-400">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
                <Flaticon name={emptyIconName} className="text-2xl text-slate-400" />
            </div>
            <p className="text-sm font-medium">{emptyText}</p>
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
                        className={`cursor-pointer w-full text-left bg-white border rounded-2xl p-4 sm:p-5 transition-all animate-fade-up shadow-xs ${
                            isStageC
                                ? 'border-red-200 hover:border-red-300'
                                : 'border-slate-200 hover:border-slate-300'
                        } ${stageGlow(e.alertStage)}`}
                        style={{ animationDelay: `${idx * 25}ms` }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5 min-w-0">
                                {e.alertStage !== 'none' && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-md border font-bold shrink-0 ${stageColor(e.alertStage)}`}>
                                        STAGE {e.alertStage}
                                    </span>
                                )}
                                <span className={`text-sm font-semibold truncate ${labelColor(e.label)}`}>
                                    {e.label.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                {e.alertScore > 0 && (
                                    <span className={`text-xs font-mono font-bold ${
                                        e.alertScore > 0.7 ? 'text-red-500' : e.alertScore > 0.4 ? 'text-orange-500' : 'text-slate-400'
                                    }`}>
                                        score {e.alertScore.toFixed(2)}
                                    </span>
                                )}
                                <span className="text-xs font-mono text-slate-400">{fmt(e.start)}–{fmt(e.end)}</span>
                                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                            </div>
                        </div>

                        {e.caption && (
                            <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">{e.caption}</p>
                        )}

                        {isOpen && (
                            <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans animate-fade-in">
                                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                    <span className="text-[10px] text-slate-400 block font-semibold">PEOPLE DETECTED</span>
                                    <span className="text-sm font-bold text-slate-800">{e.people}</span>
                                </div>
                                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                    <span className="text-[10px] text-slate-400 block font-semibold">PEAK MOTION</span>
                                    <span className="text-sm font-bold text-slate-800">{(e.peakMotion * 100).toFixed(0)}%</span>
                                </div>
                                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                    <span className="text-[10px] text-slate-400 block font-semibold">CONFIDENCE</span>
                                    <span className="text-sm font-bold text-slate-800">{(e.confidence * 100).toFixed(0)}%</span>
                                </div>
                                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                    <span className="text-[10px] text-slate-400 block font-semibold">DURATION</span>
                                    <span className="text-sm font-bold text-slate-800">{e.duration.toFixed(1)}s</span>
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
                    text: 'Ask me anything about this video. I\'ll search the footage and give you specific answers with timestamps.\n\nTry: "What happened?", "Any theft or fighting?", "Who was involved?"',
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
                ? { ...m, loading: false, streaming: false, text: 'Search query failed. Please verify connection.' }
                : m
            ))
        } finally {
            setSearching(false)
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-230px)] bg-[#F8FAFC]">
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto py-6">
                <div className="max-w-3xl mx-auto px-4 space-y-6">
                    {messages.map((msg) => (
                        msg.role === 'user' ? (
                            /* User message bubble */
                            <div key={msg.id} className="flex justify-end animate-fade-up">
                                <div className="max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-br-sm px-4.5 py-3 shadow-xs">
                                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                                </div>
                            </div>
                        ) : (
                            /* AI message */
                            <div key={msg.id} className="flex gap-3.5 animate-fade-up">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                    <Flaticon name="brain" type="sr" className="text-blue-600 text-xs" />
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    {msg.loading ? (
                                        <div className="flex items-center gap-2 pt-2">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '160ms' }} />
                                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '320ms' }} />
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs">
                                            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                                                {msg.text}
                                                {msg.streaming && (
                                                    <span className="inline-block w-1.5 h-4 bg-blue-600 ml-1 animate-blink-cursor align-middle" />
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    {/* Matching clips */}
                                    {msg.results && msg.results.length > 0 && (
                                        <div className="mt-3.5 space-y-2.5 animate-fade-up">
                                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider px-1">
                                                {msg.results.length} Evidence Clip{msg.results.length !== 1 ? 's' : ''} Identified
                                            </p>
                                            {msg.results.slice(0, 5).map((raw, i) => {
                                                const e = ev(raw)
                                                return (
                                                    <div
                                                        key={e.clipId || i}
                                                        className="bg-white rounded-xl p-3.5 text-xs shadow-xs border border-slate-200 hover:border-slate-300 transition-colors animate-fade-up"
                                                        style={{ animationDelay: `${i * 50}ms` }}
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <span className="text-slate-400 font-semibold font-mono">#{i + 1}</span>
                                                            <span className={`font-semibold ${labelColor(e.label)}`}>
                                                                {e.label.replace(/_/g, ' ')}
                                                            </span>
                                                            {e.alertStage !== 'none' && (
                                                                <span className={`text-[9px] px-1.5 py-0.5 rounded-md border font-bold ${stageColor(e.alertStage)}`}>
                                                                    STAGE {e.alertStage}
                                                                </span>
                                                            )}
                                                            <span className="text-blue-600 ml-auto font-mono font-medium">{fmt(e.start)}–{fmt(e.end)}</span>
                                                        </div>
                                                        {e.caption && (
                                                            <p className="text-slate-600 mt-1.5 line-clamp-2 leading-relaxed text-[11px]">{e.caption}</p>
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
            <div className="bg-white border-t border-slate-200 px-4 py-3.5">
                <div className="max-w-3xl mx-auto">
                    <div className="border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-3 bg-white shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <Flaticon name="search" className="text-slate-400 text-xs shrink-0" />
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            placeholder="Ask questions about this video footage (e.g. 'what did the person do?')..."
                            disabled={searching}
                            className="flex-1 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none bg-transparent disabled:opacity-50"
                        />
                        <button
                            onClick={handleSend}
                            disabled={searching || !input.trim()}
                            className="cursor-pointer shrink-0 w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center transition-all shadow-xs active:scale-95 disabled:cursor-not-allowed"
                        >
                            {searching
                                ? <Loader2 className="w-4 h-4 text-white animate-spin" />
                                : <Flaticon name="paper-plane" type="sr" className="text-white text-xs" />
                            }
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-slate-400 mt-2">
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
            <div className="bg-white rounded-2xl p-4.5 flex gap-3.5 border border-slate-200/80 shadow-xs">
                <Flaticon name="search" className="text-blue-600 text-base shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-bold text-slate-900 mb-0.5">Cross-Video Surveillance Intelligence</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Query persistent memory across <span className="text-slate-700 font-semibold">all</span> ingested surveillance streams to spot repeat suspects and security threats.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Memory Query</p>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={scoped}
                            onChange={e => setScoped(e.target.checked)}
                            className="w-3.5 h-3.5 accent-blue-600 rounded"
                        />
                        <span>Scope to this video only</span>
                    </label>
                </div>

                <div className="border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-3 bg-white shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <Flaticon name="search" className="text-slate-400 text-xs shrink-0" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleQuery()}
                        placeholder="e.g. Has this person or similar prowler been observed before?"
                        className="flex-1 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none bg-transparent"
                    />
                    <button
                        onClick={handleQuery}
                        disabled={loading || !query.trim()}
                        className="cursor-pointer shrink-0 w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white flex items-center justify-center transition-all active:scale-95 disabled:cursor-not-allowed shadow-xs"
                    >
                        {loading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Flaticon name="search" className="text-white text-xs" />}
                    </button>
                </div>

                {!result && !loading && (
                    <div className="flex flex-wrap gap-2 pt-1">
                        {suggestions.map(s => (
                            <button
                                key={s}
                                onClick={() => setQuery(s)}
                                className="cursor-pointer text-xs px-3 py-1.5 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {loading && (
                <div className="flex items-center justify-center gap-2.5 py-8 text-slate-400 text-xs">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Searching cross-stream surveillance memories...</span>
                </div>
            )}

            {error && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                    <Flaticon name="exclamation" className="text-red-500 text-xs shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {result && !loading && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4 animate-fade-up">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Flaticon name="brain" type="sr" className="text-blue-600 text-xs" />
                            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Forensic Memory Analysis</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{result.answer}</p>
                    </div>

                    {result.memories.length > 0 && (
                        <div className="space-y-2.5">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Matched Video Memories ({result.memories.length})</p>
                            {result.memories.map((mem, i) => (
                                <div key={i} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2 font-mono text-slate-500">
                                            {typeof mem.metadata?.video_name === 'string' && (
                                                <span className="font-semibold text-slate-700 truncate max-w-xs">{mem.metadata.video_name}</span>
                                            )}
                                            {typeof mem.metadata?.start === 'number' && (
                                                <span>{fmt(mem.metadata.start)}–{fmt(mem.metadata.end as number)}</span>
                                            )}
                                        </div>
                                        {mem.score > 0 && <span className="text-[10px] text-blue-600 font-semibold">Score: {(mem.score * 100).toFixed(0)}%</span>}
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-4 whitespace-pre-line">
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
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
    )
    if (!data) return (
        <div className="text-center py-24 text-slate-400">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
                <Flaticon name="stats" className="text-2xl opacity-40 text-slate-400" />
            </div>
            <p className="text-sm">No telemetry insights available</p>
        </div>
    )

    const maxTypeCount = Math.max(...Object.values(data.event_types), 1)

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">
            {/* Stats bento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Total Events', value: data.total_events, iconName: 'pulse', cls: 'bg-blue-50 border-blue-100 text-blue-600' },
                    { label: 'Threat Alerts', value: data.total_alerts, iconName: 'bell', cls: 'bg-red-50 border-red-100 text-red-600' },
                    { label: 'Event Types', value: Object.keys(data.event_types).length, iconName: 'apps', cls: 'bg-purple-50 border-purple-100 text-purple-600' },
                    { label: 'Max People', value: Math.max(...data.timeline.map(t => t.people), 0), iconName: 'users', cls: 'bg-emerald-50 border-emerald-100 text-emerald-600' },
                ].map(({ label, value, iconName, cls }) => (
                    <div key={label} className={`rounded-2xl p-4 border animate-fade-up ${cls}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Flaticon name={iconName} className="text-xs opacity-80" />
                            <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
                        </div>
                        <div className="text-2xl font-bold">{value}</div>
                    </div>
                ))}
            </div>

            {/* Event distribution */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Classified Event Distribution</h3>
                <div className="space-y-3">
                    {Object.entries(data.event_types).sort((a, b) => b[1] - a[1]).map(([label, count]) => (
                        <div key={label} className="flex items-center gap-3">
                            <span className={`text-xs w-40 truncate font-semibold ${labelColor(label)}`}>{label.replace(/_/g, ' ')}</span>
                            <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 rounded-full transition-all duration-700"
                                    style={{ width: `${(count / maxTypeCount) * 100}%` }}
                                />
                            </div>
                            <span className="text-xs text-slate-500 w-8 text-right font-mono">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Alert severity */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Threat Alert Severity</h3>
                <div className="flex gap-3">
                    {(['C', 'B', 'A'] as const).map(stage => {
                        const count = data.alert_stages[stage] || 0
                        return (
                            <div key={stage} className={`flex-1 rounded-2xl p-4 border ${stageColor(stage)} ${count > 0 ? stageGlow(stage) : ''}`}>
                                <div className="text-2xl font-bold font-mono">{count}</div>
                                <div className="text-[11px] opacity-70 mt-1">Stage {stage} Threats</div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Surveillance Activity Timeline</h3>
                <div className="relative h-20 bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                    {data.timeline.length > 0 && (() => {
                        const maxEnd = Math.max(...data.timeline.map(t => t.end), 1)
                        return data.timeline.map((t, i) => {
                            const left  = (t.start / maxEnd) * 100
                            const width = Math.max(((t.end - t.start) / maxEnd) * 100, 0.75)
                            const color = t.alert_stage === 'C' ? 'bg-red-500' :
                                          t.alert_stage === 'B' ? 'bg-orange-500' :
                                          t.alert_stage === 'A' ? 'bg-amber-400' : 'bg-blue-500'
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
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2 px-1">
                    <span>0:00</span>
                    <span>{fmt(Math.max(...data.timeline.map(t => t.end), 0))}</span>
                </div>
            </div>
        </div>
    )
}
