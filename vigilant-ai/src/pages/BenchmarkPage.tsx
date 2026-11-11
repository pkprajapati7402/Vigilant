import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    ArrowLeft, Zap, Database, Cpu, Server, Activity,
    Clock, Layers, GitBranch, Search, RefreshCw, Eye
} from 'lucide-react'
import { api, type ModalBenchmark, type VectorAIBenchmark } from '../api'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function MetricCard({
    icon, label, value, unit, color, sub,
}: {
    icon: React.ReactNode
    label: string
    value: string | number
    unit?: string
    color: 'indigo' | 'violet' | 'emerald' | 'orange' | 'red' | 'cyan'
    sub?: string
}) {
    const colors: Record<string, { border: string; text: string; glow: string }> = {
        indigo:  { border: 'border-indigo-500/30',  text: 'text-indigo-400',  glow: 'glow-indigo' },
        violet:  { border: 'border-violet-500/30',  text: 'text-violet-400',  glow: 'glow-indigo' },
        emerald: { border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'glow-emerald' },
        orange:  { border: 'border-amber-500/30',   text: 'text-amber-400',   glow: 'glow-amber' },
        red:     { border: 'border-red-500/30',     text: 'text-red-400',     glow: 'glow-red' },
        cyan:    { border: 'border-cyan-500/30',    text: 'text-cyan-400',    glow: 'glow-emerald' },
    }
    const c = colors[color] || colors.orange

    return (
        <div className={`glass-card rounded-2xl p-4 sm:p-5 border ${c.border} animate-fade-up shadow-md`}>
            <div className="flex items-center gap-2 mb-2">
                <span className={c.text}>{icon}</span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono font-semibold">{label}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${c.text}`}>{value}</span>
                {unit && <span className="text-xs text-zinc-400 font-mono">{unit}</span>}
            </div>
            {sub && <p className="text-[10px] text-zinc-500 font-mono mt-1">{sub}</p>}
        </div>
    )
}

function SectionHeader({ icon, title, badge }: { icon: React.ReactNode; title: string; badge: string }) {
    return (
        <div className="flex items-center gap-3.5 mb-5">
            <div className="relative w-10 h-10 shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl blur-sm opacity-50" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-[#121826] to-[#1c2438] border border-amber-500/40 rounded-xl flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <div>
                <h2 className="text-base font-bold text-white tracking-tight">{title}</h2>
                <span className="text-[10px] text-zinc-400 font-mono">{badge}</span>
            </div>
        </div>
    )
}

// ─── Modal Section ────────────────────────────────────────────────────────────

function ModalSection({ data }: { data: ModalBenchmark | null }) {
    if (!data) return (
        <div className="flex justify-center items-center py-16 text-zinc-400 text-xs font-mono">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-400 mr-2" /> Loading compute metrics…
        </div>
    )

    const hasData = data.total_videos_processed > 0

    return (
        <div className="space-y-6">
            <SectionHeader
                icon={<Zap className="w-5 h-5 text-amber-400" />}
                title="Parallel GPU Compute Telemetry"
                badge="Modal Cloud · A100 GPU Clusters · Up to 50 Parallel Containers"
            />

            {/* Key metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <MetricCard icon={<Zap className="w-3.5 h-3.5" />}    label="Parallel Speedup"    value={hasData ? `${data.speedup_x}×` : '—'} color="orange" sub="vs sequential CPU baseline" />
                <MetricCard icon={<Server className="w-3.5 h-3.5" />} label="GPU Node"           value={data.gpu_type}                        color="violet" sub={`${data.max_containers} max containers`} />
                <MetricCard icon={<Layers className="w-3.5 h-3.5" />} label="Sub-clips Done"     value={data.total_subclips_processed}        color="indigo" sub={`${data.total_chunks} chunks`} />
                <MetricCard icon={<Activity className="w-3.5 h-3.5" />} label="Videos Analyzed"  value={data.total_videos_processed}          color="emerald" sub="total surveillance archives" />
            </div>

            {/* GPU Model Stack — VRAM hero */}
            <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-lg">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono font-semibold mb-3">
                    Neural Network Stack · VRAM Allocation (40 GB)
                </p>
                <div className="h-6 bg-zinc-950 rounded-lg overflow-hidden flex mb-3 border border-white/10">
                    <div className="h-full bg-gradient-to-r from-red-500 to-orange-500" style={{ width: '5%' }} title="YOLO11-L ~2GB" />
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500" style={{ width: '3.75%' }} title="CLIP ViT-L/14 ~1.5GB" />
                    <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500" style={{ width: '38.75%' }} title="Qwen2.5-VL-7B ~15.5GB" />
                    <div className="h-full bg-zinc-800/60 flex-1" title="Free ~21GB" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    {[
                        { color: 'bg-gradient-to-r from-red-500 to-orange-500',    label: 'YOLO11-L',       vram: '~2 GB',    task: 'Object Tracking' },
                        { color: 'bg-gradient-to-r from-cyan-400 to-indigo-500',   label: 'CLIP ViT-L/14',  vram: '~1.5 GB',  task: '768-dim Embed' },
                        { color: 'bg-gradient-to-r from-violet-500 to-purple-500', label: 'Qwen2.5-VL-7B', vram: '~15.5 GB', task: 'Vision Caption' },
                        { color: 'bg-zinc-700',                                     label: 'Free Headroom',  vram: '~21 GB',   task: 'Dynamic Batch' },
                    ].map(({ color, label, vram, task }) => (
                        <div key={label} className="flex items-start gap-2">
                            <div className={`w-2.5 h-2.5 rounded-sm ${color} shrink-0 mt-0.5`} />
                            <div>
                                <p className="text-zinc-200 font-medium">{label}</p>
                                <p className="text-zinc-400 text-[10px]">{vram} · {task}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Speedup bar */}
            {hasData && (
                <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-lg">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono font-semibold mb-4">
                        GPU Acceleration vs Sequential CPU Execution
                    </p>
                    <div className="space-y-3.5">
                        <div>
                            <div className="flex justify-between text-xs text-zinc-300 font-mono mb-1.5">
                                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> Parallel Inference</span>
                                <span className="text-amber-400 font-bold">{data.total_gpu_time_s}s</span>
                            </div>
                            <div className="h-3 bg-zinc-950 rounded-full overflow-hidden border border-white/10">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min((data.total_gpu_time_s / data.estimated_serial_s) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-zinc-500 font-mono mb-1.5">
                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Sequential Baseline (estimated)</span>
                                <span>{data.estimated_serial_s}s</span>
                            </div>
                            <div className="h-3 bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-zinc-800 rounded-full w-full" />
                            </div>
                        </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono mt-3">
                        Baseline calculation: {data.total_subclips_processed} subclips × 8.0s/clip on single CPU core = {data.estimated_serial_s}s
                    </p>
                </div>
            )}

            {/* Timing breakdown */}
            {hasData && (
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Avg GPU Time',    value: `${data.avg_gpu_time_s}s`,     sub: 'per video stream', cls: 'text-amber-400' },
                        { label: 'Avg CPU Time',    value: `${data.avg_cpu_time_s}s`,     sub: 'motion detection', cls: 'text-zinc-300' },
                        { label: 'Total Processing', value: `${data.total_processing_s}s`, sub: 'combined workload', cls: 'text-white' },
                    ].map(({ label, value, sub, cls }) => (
                        <div key={label} className="glass-card rounded-2xl p-4 text-center border border-white/10 shadow-sm">
                            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono mb-1">{label}</p>
                            <p className={`text-xl font-bold font-mono ${cls}`}>{value}</p>
                            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{sub}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Per-video table */}
            {data.videos.length > 0 && (
                <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                    <div className="px-5 py-3.5 border-b border-white/[0.08] bg-zinc-900/60">
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono font-semibold">Video Stream Breakdown</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs font-mono">
                            <thead>
                                <tr className="border-b border-white/[0.08] text-zinc-500">
                                    <th className="px-5 py-3 text-left font-semibold">Video Stream</th>
                                    <th className="px-3 py-3 text-right font-semibold">Chunks</th>
                                    <th className="px-3 py-3 text-right font-semibold">Sub-clips</th>
                                    <th className="px-3 py-3 text-right font-semibold">GPU Time</th>
                                    <th className="px-3 py-3 text-right font-semibold">CPU Time</th>
                                    <th className="px-5 py-3 text-right font-semibold">Total Duration</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.05]">
                                {data.videos.map((v, i) => (
                                    <tr key={i} className="hover:bg-zinc-800/40 transition-colors">
                                        <td className="px-5 py-3 text-zinc-200 truncate max-w-[200px] font-medium">{v.name}</td>
                                        <td className="px-3 py-3 text-right text-zinc-400">{v.chunks}</td>
                                        <td className="px-3 py-3 text-right text-zinc-400">{v.subclips}</td>
                                        <td className="px-3 py-3 text-right text-amber-400 font-bold">{v.gpu_time_s}s</td>
                                        <td className="px-3 py-3 text-right text-zinc-400">{v.cpu_time_s}s</td>
                                        <td className="px-5 py-3 text-right text-zinc-200 font-bold">{v.processing_s}s</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Architecture specs */}
            <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3 shadow-sm">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono font-semibold">Pipeline Architecture</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    {[
                        { icon: <GitBranch className="w-3.5 h-3.5 text-zinc-400" />, label: 'CPU Motion Phase', value: 'chunk_and_score()' },
                        { icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,       label: 'GPU Inference Phase', value: 'FeatureExtractor()' },
                        { icon: <Server className="w-3.5 h-3.5 text-violet-400" />,  label: 'Object Detection',  value: 'YOLO11 + CLIP ViT-L' },
                        { icon: <Layers className="w-3.5 h-3.5 text-cyan-400" />,    label: 'Forensic Synthesis', value: 'Gemini 3.5 Multimodal' },
                    ].map(({ icon, label, value }) => (
                        <div key={label} className="bg-zinc-950/60 p-3 rounded-xl border border-white/5 space-y-1">
                            <div className="flex items-center gap-1.5 text-zinc-400">
                                {icon}
                                <span className="uppercase text-[9px] font-semibold">{label}</span>
                            </div>
                            <span className="text-zinc-200 text-xs block font-bold truncate">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─── VectorAI Section ─────────────────────────────────────────────────────────

function VectorAISection({
    data, onRefresh, refreshing,
}: {
    data: VectorAIBenchmark | null
    onRefresh: () => void
    refreshing: boolean
}) {
    if (!data) return (
        <div className="flex justify-center items-center py-16 text-zinc-400 text-xs font-mono">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400 mr-2" /> Running vector similarity test…
        </div>
    )

    const latencyColor = data.hybrid_search_latency_ms < 100 ? 'text-emerald-400' :
                         data.hybrid_search_latency_ms < 300 ? 'text-amber-400' : 'text-orange-400'

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <SectionHeader
                    icon={<Database className="w-5 h-5 text-cyan-400" />}
                    title="Vector Similarity & Search Telemetry"
                    badge="CLIP 768-dim Embeddings · COSINE Distance Metric · gRPC"
                />
                <button
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="cursor-pointer flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-white px-3.5 py-2 bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-white/20 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
                    <span>{refreshing ? 'Benchmarking…' : 'Re-run Test'}</span>
                </button>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <MetricCard icon={<Search className="w-3.5 h-3.5" />}   label="Hybrid Search"    value={data.hybrid_search_latency_ms} unit="ms" color="cyan"    sub="vector + text query" />
                <MetricCard icon={<Cpu className="w-3.5 h-3.5" />}      label="CLIP Text Encode" value={data.clip_encode_latency_ms}   unit="ms" color="indigo"  sub="text → 768-dim vector" />
                <MetricCard icon={<Database className="w-3.5 h-3.5" />} label="Indexed Vectors"  value={data.total_vectors}                      color="violet"  sub="CLIP video embeddings" />
                <MetricCard icon={<Layers className="w-3.5 h-3.5" />}   label="Dimensions"       value={data.dimensions}                         color="emerald" sub={data.distance_metric} />
            </div>

            {/* Latency gauge */}
            <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-lg">
                <div className="flex items-center justify-between mb-3 font-mono">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">Live Hybrid Query Latency</p>
                    <span className={`text-sm font-bold ${latencyColor}`}>
                        {data.hybrid_search_latency_ms} ms
                    </span>
                </div>
                <div className="h-3 bg-zinc-950 rounded-full overflow-hidden mb-2 border border-white/10">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ${
                            data.hybrid_search_latency_ms < 100 ? 'bg-gradient-to-r from-emerald-400 to-cyan-500' :
                            data.hybrid_search_latency_ms < 300 ? 'bg-gradient-to-r from-amber-400 to-orange-400' :
                            'bg-gradient-to-r from-orange-400 to-red-400'
                        }`}
                        style={{ width: `${Math.min((data.hybrid_search_latency_ms / 500) * 100, 100)}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono mb-4">
                    <span>0ms (instant)</span>
                    <span>250ms</span>
                    <span>500ms</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="flex items-center gap-2 text-zinc-400">
                        <div className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span>Semantic Vector Matching</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                        <div className="w-2 h-2 rounded-full bg-indigo-400" />
                        <span>SQLite Keyword Retrieval</span>
                    </div>
                </div>
            </div>

            {/* Technical Specs */}
            <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2 shadow-sm">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono font-semibold">Database Engine Specifications</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
                    {[
                        { label: 'Collection Name', value: data.collection },
                        { label: 'Embedding Model', value: data.model },
                        { label: 'Distance Metric', value: data.distance_metric },
                        { label: 'Vector Dimensions', value: String(data.dimensions) },
                        { label: 'Results / Query', value: String(data.results_returned) },
                        { label: 'Strategy',        value: 'Hybrid (CLIP + Text)' },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-zinc-950/60 p-3 rounded-xl border border-white/5">
                            <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">{label}</span>
                            <span className="text-xs text-zinc-200 font-bold mt-0.5 block truncate">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BenchmarkPage() {
    const navigate = useNavigate()
    const [modalData,  setModalData]  = useState<ModalBenchmark | null>(null)
    const [vectorData, setVectorData] = useState<VectorAIBenchmark | null>(null)
    const [vectorRefreshing, setVectorRefreshing] = useState(false)

    useEffect(() => {
        api.modalBenchmarks().then(setModalData).catch(console.error)
        runVectorTest()
    }, [])

    const runVectorTest = () => {
        setVectorRefreshing(true)
        api.vectoraiBenchmarks().then(setVectorData).catch(console.error).finally(() => setVectorRefreshing(false))
    }

    return (
        <div className="min-h-screen bg-[#080c14] text-slate-100 relative overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
            {/* Tactical Grid & Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden bg-tactical-grid opacity-30" />
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 left-1/3 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-30 bg-[#080c14]/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-2xl shadow-black/40">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
                    <button
                        onClick={() => navigate('/')}
                        className="cursor-pointer p-2 hover:bg-zinc-800/80 rounded-xl transition-all text-zinc-400 hover:text-white border border-white/5 hover:border-white/15"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative w-8 h-8 shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg blur-sm opacity-50" />
                            <div className="relative w-8 h-8 bg-gradient-to-br from-[#121826] to-[#1c2438] border border-amber-500/40 rounded-lg flex items-center justify-center">
                                <Eye className="w-4 h-4 text-amber-400" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-white tracking-tight">Compute & Retrieval Benchmarks</h1>
                            <p className="text-[10px] text-zinc-400 font-mono">Live latency and throughput telemetry</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 relative z-10">
                {/* Hero */}
                <div className="text-center py-4 animate-fade-up">
                    <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent mb-2">
                        System Performance & Compute Telemetry
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto font-mono">
                        Measured from live surveillance workloads. Modal GPU provides scalable parallel inference;
                        Vector similarity indexing handles 768-dimensional CLIP forensic retrieval.
                    </p>
                </div>

                {/* Modal Section */}
                <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-white/10 shadow-2xl animate-fade-up">
                    <ModalSection data={modalData} />
                </div>

                {/* VectorAI Section */}
                <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-white/10 shadow-2xl animate-fade-up">
                    <VectorAISection
                        data={vectorData}
                        onRefresh={runVectorTest}
                        refreshing={vectorRefreshing}
                    />
                </div>

                <p className="text-center text-[11px] text-zinc-500 font-mono pb-6">
                    VIGILANT AI · PRODUCTION BENCHMARK TELEMETRY
                </p>
            </main>
        </div>
    )
}
