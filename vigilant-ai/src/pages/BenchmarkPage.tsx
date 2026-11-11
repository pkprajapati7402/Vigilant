import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    ArrowLeft, Zap, Database, Cpu, Server, Activity,
    Clock, Layers, GitBranch, Search, RefreshCw, Shield
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
    color: 'indigo' | 'violet' | 'emerald' | 'orange' | 'red' | 'cyan' | 'blue'
    sub?: string
}) {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
        blue:    { bg: 'bg-blue-50',    border: 'border-blue-100',    text: 'text-blue-600' },
        indigo:  { bg: 'bg-indigo-50',  border: 'border-indigo-100',  text: 'text-indigo-600' },
        violet:  { bg: 'bg-purple-50',  border: 'border-purple-100',  text: 'text-purple-600' },
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600' },
        orange:  { bg: 'bg-orange-50',  border: 'border-orange-100',  text: 'text-orange-600' },
        red:     { bg: 'bg-red-50',     border: 'border-red-100',     text: 'text-red-600' },
        cyan:    { bg: 'bg-cyan-50',    border: 'border-cyan-100',    text: 'text-cyan-600' },
    }
    const c = colors[color] || colors.blue

    return (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between animate-fade-up">
            <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center shrink-0 ${c.text}`}>
                    {icon}
                </div>
                <span className="text-xs font-semibold text-slate-800">{label}</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-3xl font-bold text-slate-900 font-sans tabular-nums">{value}</span>
                {unit && <span className="text-xs text-slate-400 font-mono">{unit}</span>}
            </div>
            {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
    )
}

function SectionHeader({ icon, title, badge }: { icon: React.ReactNode; title: string; badge: string }) {
    return (
        <div className="flex items-center gap-3.5 mb-5">
            <div className="w-10 h-10 rounded-xl border border-blue-200 bg-blue-50/70 text-blue-600 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">{title}</h2>
                <span className="text-xs text-slate-400 font-normal">{badge}</span>
            </div>
        </div>
    )
}

// ─── Modal Section ────────────────────────────────────────────────────────────

function ModalSection({ data }: { data: ModalBenchmark | null }) {
    if (!data) return (
        <div className="flex justify-center items-center py-16 text-slate-400 text-xs">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600 mr-2" /> Loading compute telemetry…
        </div>
    )

    const hasData = data.total_videos_processed > 0

    return (
        <div className="space-y-6">
            <SectionHeader
                icon={<Zap className="w-5 h-5 text-blue-600" />}
                title="Parallel GPU Compute Telemetry"
                badge="Modal Cloud · A100 GPU Clusters · Up to 50 Parallel Containers"
            />

            {/* Key metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <MetricCard icon={<Zap className="w-3.5 h-3.5" />}    label="Parallel Speedup"    value={hasData ? `${data.speedup_x}×` : '—'} color="blue" sub="vs sequential CPU baseline" />
                <MetricCard icon={<Server className="w-3.5 h-3.5" />} label="GPU Node"           value={data.gpu_type}                        color="violet" sub={`${data.max_containers} max containers`} />
                <MetricCard icon={<Layers className="w-3.5 h-3.5" />} label="Sub-clips Done"     value={data.total_subclips_processed}        color="indigo" sub={`${data.total_chunks} chunks`} />
                <MetricCard icon={<Activity className="w-3.5 h-3.5" />} label="Videos Analyzed"  value={data.total_videos_processed}          color="emerald" sub="surveillance archives" />
            </div>

            {/* GPU Model Stack — VRAM Allocation */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                    Neural Network Stack · VRAM Allocation (40 GB)
                </p>
                <div className="h-6 bg-slate-200 rounded-lg overflow-hidden flex mb-3 border border-slate-300/60">
                    <div className="h-full bg-orange-500" style={{ width: '5%' }} title="YOLO11-L ~2GB" />
                    <div className="h-full bg-cyan-500" style={{ width: '3.75%' }} title="CLIP ViT-L/14 ~1.5GB" />
                    <div className="h-full bg-purple-500" style={{ width: '38.75%' }} title="Qwen2.5-VL-7B ~15.5GB" />
                    <div className="h-full bg-slate-100 flex-1" title="Free ~21GB" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {[
                        { color: 'bg-orange-500', label: 'YOLO11-L',       vram: '~2 GB',    task: 'Object Tracking' },
                        { color: 'bg-cyan-500',   label: 'CLIP ViT-L/14',  vram: '~1.5 GB',  task: '768-dim Embeddings' },
                        { color: 'bg-purple-500', label: 'Qwen2.5-VL-7B', vram: '~15.5 GB', task: 'Vision Captioning' },
                        { color: 'bg-slate-300',  label: 'Free Headroom',  vram: '~21 GB',   task: 'Dynamic Batching' },
                    ].map(({ color, label, vram, task }) => (
                        <div key={label} className="flex items-start gap-2">
                            <div className={`w-2.5 h-2.5 rounded-sm ${color} shrink-0 mt-0.5`} />
                            <div>
                                <p className="text-slate-800 font-medium">{label}</p>
                                <p className="text-slate-400 text-[11px]">{vram} · {task}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Speedup bar */}
            {hasData && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">
                        GPU Acceleration vs Sequential CPU Execution
                    </p>
                    <div className="space-y-3.5">
                        <div>
                            <div className="flex justify-between text-xs text-slate-700 mb-1.5 font-medium">
                                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-blue-600" /> Parallel Inference</span>
                                <span className="text-blue-600 font-bold font-mono">{data.total_gpu_time_s}s</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min((data.total_gpu_time_s / data.estimated_serial_s) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Sequential Baseline (estimated)</span>
                                <span className="font-mono">{data.estimated_serial_s}s</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-300 rounded-full w-full" />
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3">
                        Baseline calculation: {data.total_subclips_processed} subclips × 8.0s/clip on single CPU core = {data.estimated_serial_s}s
                    </p>
                </div>
            )}

            {/* Timing breakdown */}
            {hasData && (
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Avg GPU Time',    value: `${data.avg_gpu_time_s}s`,     sub: 'per video stream', cls: 'text-blue-600' },
                        { label: 'Avg CPU Time',    value: `${data.avg_cpu_time_s}s`,     sub: 'motion detection', cls: 'text-slate-700' },
                        { label: 'Total Processing', value: `${data.total_processing_s}s`, sub: 'combined workload', cls: 'text-slate-900' },
                    ].map(({ label, value, sub, cls }) => (
                        <div key={label} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center shadow-xs">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">{label}</p>
                            <p className={`text-xl font-bold font-mono ${cls}`}>{value}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Per-video table */}
            {data.videos.length > 0 && (
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs">
                    <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Video Stream Breakdown</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                                    <th className="px-5 py-3 text-left">Video Stream</th>
                                    <th className="px-3 py-3 text-right">Chunks</th>
                                    <th className="px-3 py-3 text-right">Sub-clips</th>
                                    <th className="px-3 py-3 text-right">GPU Time</th>
                                    <th className="px-3 py-3 text-right">CPU Time</th>
                                    <th className="px-5 py-3 text-right">Total Duration</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {data.videos.map((v, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-3 text-slate-900 truncate max-w-[200px] font-medium">{v.name}</td>
                                        <td className="px-3 py-3 text-right text-slate-400 font-mono">{v.chunks}</td>
                                        <td className="px-3 py-3 text-right text-slate-400 font-mono">{v.subclips}</td>
                                        <td className="px-3 py-3 text-right text-blue-600 font-mono font-bold">{v.gpu_time_s}s</td>
                                        <td className="px-3 py-3 text-right text-slate-400 font-mono">{v.cpu_time_s}s</td>
                                        <td className="px-5 py-3 text-right text-slate-900 font-mono font-bold">{v.processing_s}s</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Architecture specs */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Pipeline Architecture</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {[
                        { icon: <GitBranch className="w-3.5 h-3.5 text-slate-500" />, label: 'CPU Motion Phase', value: 'chunk_and_score()' },
                        { icon: <Zap className="w-3.5 h-3.5 text-blue-600" />,         label: 'GPU Inference Phase', value: 'FeatureExtractor()' },
                        { icon: <Server className="w-3.5 h-3.5 text-purple-600" />,    label: 'Object Detection',  value: 'YOLO11 + CLIP ViT-L' },
                        { icon: <Layers className="w-3.5 h-3.5 text-emerald-600" />,   label: 'Forensic Synthesis', value: 'Gemini 3.5 Multimodal' },
                    ].map(({ icon, label, value }) => (
                        <div key={label} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                            <div className="flex items-center gap-1.5 text-slate-500">
                                {icon}
                                <span className="uppercase text-[10px] font-semibold">{label}</span>
                            </div>
                            <span className="text-slate-900 text-xs block font-mono font-bold truncate">{value}</span>
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
        <div className="flex justify-center items-center py-16 text-slate-400 text-xs">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600 mr-2" /> Running vector similarity test…
        </div>
    )

    const latencyColor = data.hybrid_search_latency_ms < 100 ? 'text-emerald-600' :
                         data.hybrid_search_latency_ms < 300 ? 'text-amber-600' : 'text-orange-600'

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <SectionHeader
                    icon={<Database className="w-5 h-5 text-blue-600" />}
                    title="Vector Similarity & Search Telemetry"
                    badge="CLIP 768-dim Embeddings · COSINE Distance Metric · gRPC"
                />
                <button
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="cursor-pointer flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs active:scale-95 font-medium"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
                    <span>{refreshing ? 'Benchmarking…' : 'Re-run Test'}</span>
                </button>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <MetricCard icon={<Search className="w-3.5 h-3.5" />}   label="Hybrid Search"    value={data.hybrid_search_latency_ms} unit="ms" color="blue"    sub="vector + text query" />
                <MetricCard icon={<Cpu className="w-3.5 h-3.5" />}      label="CLIP Text Encode" value={data.clip_encode_latency_ms}   unit="ms" color="indigo"  sub="text → 768-dim vector" />
                <MetricCard icon={<Database className="w-3.5 h-3.5" />} label="Indexed Vectors"  value={data.total_vectors}                      color="violet"  sub="CLIP video embeddings" />
                <MetricCard icon={<Layers className="w-3.5 h-3.5" />}   label="Dimensions"       value={data.dimensions}                         color="emerald" sub={data.distance_metric} />
            </div>

            {/* Latency gauge */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Live Hybrid Query Latency</p>
                    <span className={`text-sm font-bold font-mono ${latencyColor}`}>
                        {data.hybrid_search_latency_ms} ms
                    </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div
                        className="h-full rounded-full transition-all duration-700 bg-blue-600"
                        style={{ width: `${Math.min((data.hybrid_search_latency_ms / 500) * 100, 100)}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-4">
                    <span>0ms (instant)</span>
                    <span>250ms</span>
                    <span>500ms</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                        <span>Semantic Vector Matching</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <div className="w-2 h-2 rounded-full bg-slate-400" />
                        <span>SQLite Keyword Retrieval</span>
                    </div>
                </div>
            </div>

            {/* Technical Specs */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Database Engine Specifications</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
                    {[
                        { label: 'Collection Name', value: data.collection },
                        { label: 'Embedding Model', value: data.model },
                        { label: 'Distance Metric', value: data.distance_metric },
                        { label: 'Vector Dimensions', value: String(data.dimensions) },
                        { label: 'Results / Query', value: String(data.results_returned) },
                        { label: 'Strategy',        value: 'Hybrid (CLIP + Text)' },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">{label}</span>
                            <span className="text-xs text-slate-900 font-bold mt-0.5 block truncate">{value}</span>
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
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
                    <button
                        onClick={() => navigate('/')}
                        className="cursor-pointer p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500 hover:text-slate-800 border border-slate-200 shadow-xs"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-9 h-9 rounded-xl border border-blue-200 bg-white flex items-center justify-center text-blue-600 shadow-xs shrink-0">
                            <Shield className="w-5 h-5 stroke-[1.8]" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-slate-900 tracking-tight">Compute & Retrieval Benchmarks</h1>
                            <p className="text-xs text-slate-400">Live latency and throughput telemetry</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
                {/* Hero */}
                <div className="text-center py-2 animate-fade-up">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                        System Performance & Compute Telemetry
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
                        Measured from live surveillance workloads. Modal GPU provides scalable parallel inference;
                        Vector similarity indexing handles 768-dimensional CLIP forensic retrieval.
                    </p>
                </div>

                {/* Modal Section */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs animate-fade-up">
                    <ModalSection data={modalData} />
                </div>

                {/* VectorAI Section */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs animate-fade-up">
                    <VectorAISection
                        data={vectorData}
                        onRefresh={runVectorTest}
                        refreshing={vectorRefreshing}
                    />
                </div>

                <p className="text-center text-xs text-slate-400 pb-6">
                    VIGILANT AI · PRODUCTION BENCHMARK TELEMETRY
                </p>
            </main>
        </div>
    )
}
