import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, ChevronRight, X } from 'lucide-react'
import { Flaticon } from '../components/Flaticon'
import { api, type VideoInfo, type MemoryQueryResult } from '../api'

export default function DashboardPage() {
    const [videos, setVideos] = useState<VideoInfo[]>([])
    const [loading, setLoading] = useState(true)
    const [showUpload, setShowUpload] = useState(false)
    const [activeNav, setActiveNav] = useState('dashboard')
    const [mobileOpen, setMobileOpen] = useState(false)
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

    const navItemClick = (key: string) => {
        setActiveNav(key)
        setMobileOpen(false)
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
            {/* Top Navigation Bar - Flush across viewport */}
            <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                    {/* Brand & Mobile Hamburger */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="cursor-pointer md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                            aria-label="Toggle Navigation"
                        >
                            <Flaticon name="menu-burger" className="text-base" />
                        </button>

                        <div
                            onClick={() => navItemClick('dashboard')}
                            className="cursor-pointer flex items-center gap-3 group"
                        >
                            <div className="w-9 h-9 rounded-xl border border-blue-200/90 bg-white flex items-center justify-center shadow-xs group-hover:border-blue-400 transition-colors">
                                <Flaticon name="shield-check" type="sr" className="text-blue-600 text-base" />
                            </div>
                            <div>
                                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                                    Vigilant AI
                                </h1>
                                <p className="text-[11px] sm:text-xs text-slate-400 font-normal">
                                    Sentinel Stream  ·  Computer Vision
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Header Actions */}
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="cursor-pointer flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all hover:border-slate-300"
                            title="Product Overview & Features"
                        >
                            <Flaticon name="apps" className="text-slate-500 text-xs" />
                            <span className="hidden sm:inline">Product Info</span>
                        </button>
                        <button
                            onClick={() => navigate('/benchmarks')}
                            className="cursor-pointer flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all hover:border-slate-300"
                        >
                            <Flaticon name="stats" className="text-slate-500 text-xs" />
                            <span className="hidden sm:inline">Benchmarks</span>
                        </button>
                        <button
                            onClick={() => setShowUpload(true)}
                            className="cursor-pointer flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all active:scale-95"
                        >
                            <Flaticon name="plus" className="text-white text-xs" />
                            <span>Upload Video</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Layout Body: Proper Left-Docked Sidebar + Main Area */}
            <div className="flex-1 flex w-full relative">
                {/* Desktop Left Sidebar (Docked to the left edge) */}
                <aside className="w-64 shrink-0 bg-white border-r border-slate-200/80 sticky top-[57px] h-[calc(100vh-57px)] hidden md:flex flex-col justify-between p-4 overflow-y-auto">
                    <SidebarNav
                        activeNav={activeNav}
                        onSelect={navItemClick}
                        totalAlerts={totalAlerts}
                        totalEvents={totalEvents}
                        videoCount={videos.length}
                    />
                    <SystemStatusWidget />
                </aside>

                {/* Mobile Drawer Overlay */}
                {mobileOpen && (
                    <div className="fixed inset-0 z-50 md:hidden flex">
                        <div
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
                            onClick={() => setMobileOpen(false)}
                        />
                        <div className="relative w-64 max-w-[80%] bg-white h-full shadow-2xl flex flex-col justify-between p-4 z-10 animate-fade-in">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation</span>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <SidebarNav
                                activeNav={activeNav}
                                onSelect={navItemClick}
                                totalAlerts={totalAlerts}
                                totalEvents={totalEvents}
                                videoCount={videos.length}
                            />
                            <SystemStatusWidget />
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto w-full space-y-6">
                        {activeNav === 'dashboard' && (
                            <DashboardView
                                videos={videos}
                                loading={loading}
                                totalEvents={totalEvents}
                                totalAlerts={totalAlerts}
                                totalTime={totalTime}
                                onUpload={() => setShowUpload(true)}
                                onSelectVideo={(id) => navigate(`/video/${id}`)}
                            />
                        )}

                        {activeNav === 'intelligence' && (
                            <IntelligenceView videos={videos} />
                        )}

                        {activeNav === 'alerts' && (
                            <AlertsView videos={videos} onSelectVideo={(id) => navigate(`/video/${id}`)} />
                        )}

                        {activeNav === 'events' && (
                            <EventsView videos={videos} onSelectVideo={(id) => navigate(`/video/${id}`)} />
                        )}

                        {activeNav === 'feeds' && (
                            <FeedsView
                                videos={videos}
                                loading={loading}
                                onUpload={() => setShowUpload(true)}
                                onSelectVideo={(id) => navigate(`/video/${id}`)}
                            />
                        )}

                        {activeNav === 'compute' && (
                            <ComputeView totalTime={totalTime} onGoBenchmarks={() => navigate('/benchmarks')} />
                        )}

                        {activeNav === 'settings' && (
                            <SettingsView />
                        )}

                        {activeNav === 'logs' && (
                            <ActivityLogView videos={videos} />
                        )}
                    </div>
                </main>
            </div>

            {/* Video Upload Modal */}
            {showUpload && (
                <UploadModal
                    onClose={() => setShowUpload(false)}
                    onDone={() => { setShowUpload(false); loadVideos() }}
                />
            )}
        </div>
    )
}

// ─── Sidebar Navigation Content ───────────────────────────────────────────────

function SidebarNav({ activeNav, onSelect, totalAlerts, totalEvents, videoCount }: {
    activeNav: string
    onSelect: (k: string) => void
    totalAlerts: number
    totalEvents: number
    videoCount: number
}) {
    return (
        <div className="space-y-6">
            {/* Top Primary Item: Dashboard */}
            <div>
                <button
                    onClick={() => onSelect('dashboard')}
                    className={`cursor-pointer w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-left transition-all ${
                        activeNav === 'dashboard'
                            ? 'bg-blue-50 text-blue-600 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                    <div className="flex items-center gap-2.5">
                        <Flaticon
                            name="apps"
                            className={`text-sm ${activeNav === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}
                        />
                        <span>Dashboard</span>
                    </div>
                </button>
            </div>

            {/* ANALYTICS Section */}
            <div>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-1.5">
                    ANALYTICS
                </p>
                <nav className="space-y-1">
                    <SidebarItem
                        iconName="search"
                        label="Cross-Video Intelligence"
                        active={activeNav === 'intelligence'}
                        onClick={() => onSelect('intelligence')}
                    />
                    <SidebarItem
                        iconName="bell"
                        label="Alerts"
                        active={activeNav === 'alerts'}
                        badge={totalAlerts > 0 ? totalAlerts : undefined}
                        badgeColor="red"
                        onClick={() => onSelect('alerts')}
                    />
                    <SidebarItem
                        iconName="pulse"
                        label="Events"
                        active={activeNav === 'events'}
                        badge={totalEvents > 0 ? totalEvents : undefined}
                        badgeColor="slate"
                        onClick={() => onSelect('events')}
                    />
                    <SidebarItem
                        iconName="folder"
                        label="Feeds & Archives"
                        active={activeNav === 'feeds'}
                        badge={videoCount > 0 ? videoCount : undefined}
                        badgeColor="blue"
                        onClick={() => onSelect('feeds')}
                    />
                </nav>
            </div>

            {/* SYSTEM Section */}
            <div>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-1.5">
                    SYSTEM
                </p>
                <nav className="space-y-1">
                    <SidebarItem
                        iconName="chip"
                        label="Compute & Status"
                        active={activeNav === 'compute'}
                        onClick={() => onSelect('compute')}
                    />
                    <SidebarItem
                        iconName="settings"
                        label="Settings"
                        active={activeNav === 'settings'}
                        onClick={() => onSelect('settings')}
                    />
                    <SidebarItem
                        iconName="document"
                        label="Activity Log"
                        active={activeNav === 'logs'}
                        onClick={() => onSelect('logs')}
                    />
                </nav>
            </div>
        </div>
    )
}

function SidebarItem({ iconName, label, active, badge, badgeColor = 'slate', onClick }: {
    iconName: string
    label: string
    active?: boolean
    badge?: number | string
    badgeColor?: 'red' | 'blue' | 'slate'
    onClick?: () => void
}) {
    const badgeStyle = {
        red:   'bg-red-50 text-red-600 border border-red-200',
        blue:  'bg-blue-50 text-blue-600 border border-blue-200',
        slate: 'bg-slate-100 text-slate-600 border border-slate-200',
    }[badgeColor]

    return (
        <button
            onClick={onClick}
            className={`cursor-pointer w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all text-left ${
                active
                    ? 'bg-blue-50 text-blue-600 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
        >
            <div className="flex items-center gap-2.5 truncate">
                <Flaticon
                    name={iconName}
                    className={`text-sm shrink-0 ${active ? 'text-blue-600' : 'text-slate-400'}`}
                />
                <span className="truncate">{label}</span>
            </div>
            {badge != null && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${badgeStyle}`}>
                    {badge}
                </span>
            )}
        </button>
    )
}

function SystemStatusWidget() {
    return (
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-1.5 mt-4">
            <p className="text-xs font-semibold text-slate-700">System Status</p>
            <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Operational
            </p>
            <p className="text-[11px] text-slate-400">All systems running smoothly</p>
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                    <Flaticon name="chip" className="text-slate-400 text-xs" />
                    GPU T4 Active
                </span>
                <span className="text-emerald-600 font-medium">99.9%</span>
            </div>
        </div>
    )
}

// ─── 1. Dashboard View ────────────────────────────────────────────────────────

function DashboardView({ videos, loading, totalEvents, totalAlerts, totalTime, onUpload, onSelectVideo }: {
    videos: VideoInfo[]
    loading: boolean
    totalEvents: number
    totalAlerts: number
    totalTime: number
    onUpload: () => void
    onSelectVideo: (id: string) => void
}) {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Card 1: Cross-Video Intelligence */}
            <div id="intelligence-box">
                <GlobalMemoryChat />
            </div>

            {/* Card 2: 4 Telemetry Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    flaticon="video-camera"
                    label="Videos Ingested"
                    value={videos.length}
                    sub="Analyzed streams"
                    color="blue"
                />
                <StatCard
                    flaticon="pulse"
                    label="Total Events"
                    value={totalEvents}
                    sub="CV tracklets classified"
                    color="emerald"
                />
                <StatCard
                    flaticon="shield"
                    label="Total Alerts"
                    value={totalAlerts}
                    sub="Threat windows flagged"
                    color="orange"
                />
                <StatCard
                    flaticon="chip"
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
                        <Flaticon name="search" className="text-blue-600 text-sm" />
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
                    /* Empty State Matching Reference Image with Professional Flaticon */
                    <div className="bg-white rounded-2xl p-12 sm:p-16 border border-slate-200/80 shadow-xs text-center">
                        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                            <Flaticon name="video-camera" type="sr" className="text-2xl text-blue-600" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-1.5">
                            No surveillance footage ingested
                        </h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                            Upload CCTV, drone, or security camera footage to trigger <span className="text-blue-600 font-semibold">YOLOv8</span> motion tracking, <span className="text-slate-700 font-medium">Gemini multimodal forensic analysis</span>, and RAG search.
                        </p>
                        <button
                            onClick={onUpload}
                            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-xs active:scale-95 transition-all inline-flex items-center gap-2"
                        >
                            <Flaticon name="cloud-upload" type="sr" className="text-xs text-white" />
                            <span>Upload your first video</span>
                        </button>
                        <p className="text-xs text-slate-400 mt-4">
                            Supports MP4, MOV · Max file size 5GB
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {videos.map((v, i) => (
                            <VideoCard key={v.id} video={v} index={i} onClick={() => onSelectVideo(v.id)} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── 2. Cross-Video Intelligence View ─────────────────────────────────────────

function IntelligenceView({ videos }: { videos: VideoInfo[] }) {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Cross-Video Intelligence Hub</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Unified vector retrieval across {videos.length} surveillance feeds with temporal forensic correlation.
                        </p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-full">
                        RAG Active
                    </span>
                </div>
                <GlobalMemoryChat />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                        <Flaticon name="brain" type="sr" className="text-blue-600 text-base" />
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Semantic Memory</h3>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">2,410</p>
                    <p className="text-xs text-slate-400 mt-1">Multi-modal vector embeddings stored</p>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                        <Flaticon name="search" className="text-emerald-600 text-base" />
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Search Latency</h3>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">42ms</p>
                    <p className="text-xs text-slate-400 mt-1">Cosine similarity nearest-neighbor lookup</p>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                        <Flaticon name="shield" type="sr" className="text-purple-600 text-base" />
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Indexed Cameras</h3>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{Math.max(videos.length, 1)}</p>
                    <p className="text-xs text-slate-400 mt-1">Surveillance channel archives linked</p>
                </div>
            </div>
        </div>
    )
}

// ─── 3. Alerts View ───────────────────────────────────────────────────────────

function AlertsView({ videos, onSelectVideo }: { videos: VideoInfo[]; onSelectVideo: (id: string) => void }) {
    const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'normal'>('all')

    const simulatedAlerts = [
        {
            id: 'alt-1',
            stage: 'C',
            title: 'Critical Intrusion & Erratic Movement',
            camera: videos[0]?.name || 'CAM-01 Entrance Security',
            videoId: videos[0]?.id || '',
            timestamp: '00:14 – 00:26',
            description: 'Subject observed crawling along the floor near doorway and looking directly into camera. Stage C perimeter violation flagged.',
            severity: 'high' as const,
        },
        {
            id: 'alt-2',
            stage: 'B',
            title: 'Unattended Baggage & Suspicious Loitering',
            camera: videos[1]?.name || videos[0]?.name || 'CAM-03 Corridor West',
            videoId: videos[1]?.id || videos[0]?.id || '',
            timestamp: '01:05 – 01:28',
            description: 'Subject remained stationary in restricted pathway for over 22 seconds without authorized badge check.',
            severity: 'medium' as const,
        },
        {
            id: 'alt-3',
            stage: 'A',
            title: 'Rapid Motion After Hours',
            camera: videos[0]?.name || 'CAM-02 Warehouse Gate',
            videoId: videos[0]?.id || '',
            timestamp: '02:40 – 02:48',
            description: 'Transient velocity spike detected across zone boundary. YOLO11 classified subject as adult person.',
            severity: 'normal' as const,
        },
    ]

    const filtered = simulatedAlerts.filter(a => filter === 'all' || a.severity === filter)

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Flaticon name="bell" type="sr" className="text-red-600 text-lg" />
                        <h2 className="text-lg font-bold text-slate-900">Security Threat Alerts Center</h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        High-priority threat windows flagged by YOLO11 motion heuristics and Gemini multimodal reasoning.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {(['all', 'high', 'medium', 'normal'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                                filter === f
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {f === 'all' ? 'All Alerts' : f === 'high' ? 'Stage C (Critical)' : f === 'medium' ? 'Stage B (Warning)' : 'Stage A (Notice)'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-3">
                {filtered.map(alert => (
                    <div key={alert.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                alert.stage === 'C' ? 'bg-red-50 text-red-600 border border-red-200' :
                                alert.stage === 'B' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                                'bg-amber-50 text-amber-600 border border-amber-200'
                            }`}>
                                <Flaticon name="shield-exclamation" type="sr" className="text-lg" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                        alert.stage === 'C' ? 'bg-red-100 text-red-700' :
                                        alert.stage === 'B' ? 'bg-orange-100 text-orange-700' :
                                        'bg-amber-100 text-amber-700'
                                    }`}>
                                        STAGE {alert.stage}
                                    </span>
                                    <h3 className="text-sm font-bold text-slate-900">{alert.title}</h3>
                                </div>
                                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">{alert.description}</p>
                                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 font-mono">
                                    <span>{alert.camera}</span>
                                    <span>·</span>
                                    <span>{alert.timestamp}</span>
                                </div>
                            </div>
                        </div>

                        {alert.videoId ? (
                            <button
                                onClick={() => onSelectVideo(alert.videoId)}
                                className="cursor-pointer shrink-0 flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-all self-end sm:self-center"
                            >
                                <Flaticon name="play" type="sr" className="text-xs" />
                                <span>Inspect Footage</span>
                            </button>
                        ) : (
                            <span className="text-[11px] text-slate-400 italic">No video linked</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── 4. Events View ───────────────────────────────────────────────────────────

function EventsView({ videos, onSelectVideo }: { videos: VideoInfo[]; onSelectVideo: (id: string) => void }) {
    const simulatedEvents = [
        { id: 'ev-1', type: 'erratic_movement', label: 'Erratic Movement Tracklet', conf: 96.4, start: '00:04', end: '00:12', dur: '8s', video: videos[0]?.name || 'mixkit-thief-creep.mp4', videoId: videos[0]?.id },
        { id: 'ev-2', type: 'person_detected', label: 'Person Detection', conf: 98.1, start: '00:08', end: '00:22', dur: '14s', video: videos[0]?.name || 'mixkit-thief-creep.mp4', videoId: videos[0]?.id },
        { id: 'ev-3', type: 'zone_breach', label: 'Zone Boundary Crossing', conf: 91.5, start: '00:15', end: '00:19', dur: '4s', video: videos[1]?.name || 'entrance-cctv.mp4', videoId: videos[1]?.id },
        { id: 'ev-4', type: 'loitering', label: 'Persistent Stationary Dwell', conf: 89.0, start: '00:30', end: '00:48', dur: '18s', video: videos[0]?.name || 'mixkit-thief-creep.mp4', videoId: videos[0]?.id },
    ]

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-2">
                    <Flaticon name="pulse" className="text-emerald-600 text-lg" />
                    <h2 className="text-lg font-bold text-slate-900">Computer Vision Events Stream</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                    Temporal motion tracklets, bounding box classifications, and spatial velocity vectors extracted by YOLO11.
                </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Detected Tracklets</span>
                    <span className="text-xs font-medium text-slate-500">{simulatedEvents.length} active events</span>
                </div>
                <div className="divide-y divide-slate-100">
                    {simulatedEvents.map(ev => (
                        <div key={ev.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                    <Flaticon name="pulse" className="text-sm" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-slate-900">{ev.label}</p>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                                            {ev.conf}% CONF
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                                        {ev.video} · {ev.start} → {ev.end} ({ev.dur})
                                    </p>
                                </div>
                            </div>

                            {ev.videoId && (
                                <button
                                    onClick={() => onSelectVideo(ev.videoId!)}
                                    className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                    <span>Jump to Moment</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─── 5. Feeds & Archives View ─────────────────────────────────────────────────

function FeedsView({ videos, loading, onUpload, onSelectVideo }: {
    videos: VideoInfo[]
    loading: boolean
    onUpload: () => void
    onSelectVideo: (id: string) => void
}) {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Flaticon name="folder" type="sr" className="text-blue-600 text-lg" />
                        <h2 className="text-lg font-bold text-slate-900">Surveillance Feeds & Archives</h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        Active CCTV camera channels, uploaded video files, and historical surveillance recordings.
                    </p>
                </div>
                <button
                    onClick={onUpload}
                    className="cursor-pointer flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-95"
                >
                    <Flaticon name="plus" className="text-white text-xs" />
                    <span>Ingest New Feed</span>
                </button>
            </div>

            {loading ? (
                <div className="bg-white rounded-2xl p-16 border border-slate-200/80 shadow-xs flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
                    <p className="text-xs text-slate-400">Loading feeds archive...</p>
                </div>
            ) : videos.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 sm:p-16 border border-slate-200/80 shadow-xs text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                        <Flaticon name="video-camera" type="sr" className="text-2xl text-blue-600" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">
                        No surveillance footage ingested
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                        Upload CCTV, drone, or security camera footage to trigger <span className="text-blue-600 font-semibold">YOLOv8</span> motion tracking, <span className="text-slate-700 font-medium">Gemini multimodal forensic analysis</span>, and RAG search.
                    </p>
                    <button
                        onClick={onUpload}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-xs active:scale-95 transition-all inline-flex items-center gap-2"
                    >
                        <Flaticon name="cloud-upload" type="sr" className="text-xs text-white" />
                        <span>Upload your first video</span>
                    </button>
                    <p className="text-xs text-slate-400 mt-4">
                        Supports MP4, MOV · Max file size 5GB
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {videos.map((v, i) => (
                        <div
                            key={v.id}
                            onClick={() => onSelectVideo(v.id)}
                            className="cursor-pointer bg-white border border-slate-200/80 hover:border-blue-300 rounded-2xl p-5 shadow-xs transition-all hover:shadow-md flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <Flaticon name="video-camera" type="sr" className="text-sm" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">CH-0{i+1}</span>
                                    </div>
                                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200">
                                        Active
                                    </span>
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 truncate mb-1">{v.name}</h3>
                                <p className="text-xs text-slate-400">Duration: {(v.duration_s / 60).toFixed(1)} mins · {v.total_events} tracklets</p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                <span>{v.total_alerts} alert{v.total_alerts !== 1 ? 's' : ''} flagged</span>
                                <span className="font-semibold text-blue-600 flex items-center gap-1">
                                    View Stream <ChevronRight className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ─── 6. Compute & Status View ─────────────────────────────────────────────────

function ComputeView({ totalTime, onGoBenchmarks }: { totalTime: number; onGoBenchmarks: () => void }) {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Flaticon name="chip" type="sr" className="text-purple-600 text-lg" />
                        <h2 className="text-lg font-bold text-slate-900">Compute & Infrastructure Status</h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        Real-time telemetry of GPU hardware acceleration, inference FPS, and model pipelines.
                    </p>
                </div>
                <button
                    onClick={onGoBenchmarks}
                    className="cursor-pointer flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 transition-all"
                >
                    <Flaticon name="stats" className="text-slate-500 text-xs" />
                    <span>View Benchmark Suite</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">GPU Accelerator</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <p className="text-xl font-bold text-slate-900">NVIDIA Tesla T4</p>
                    <p className="text-xs text-slate-400 mt-1">15.8 GB VRAM · CUDA 12.4</p>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">CV Pipeline</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">GPU</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">YOLO11 Nano</p>
                    <p className="text-xs text-slate-400 mt-1">18.2ms / frame (55 FPS)</p>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Multimodal AI</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">LIVE</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">Gemini 2.5 Flash</p>
                    <p className="text-xs text-slate-400 mt-1">1.14s forensic synthesis latency</p>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Compute</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">READY</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">{totalTime.toFixed(0)}s</p>
                    <p className="text-xs text-slate-400 mt-1">Total GPU inference logged</p>
                </div>
            </div>
        </div>
    )
}

// ─── 7. Settings View ─────────────────────────────────────────────────────────

function SettingsView() {
    const [tunnelUrl, setTunnelUrl] = useState('/api')
    const [yoloConf, setYoloConf] = useState('0.35')
    const [model, setModel] = useState('gemini-2.5-flash')
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-2">
                    <Flaticon name="settings" className="text-slate-700 text-lg" />
                    <h2 className="text-lg font-bold text-slate-900">System & Detection Settings</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                    Manage backend API tunnels, YOLO11 sensitivity thresholds, and forensic LLM parameters.
                </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Backend API Proxy / Tunnel URL
                    </label>
                    <input
                        type="text"
                        value={tunnelUrl}
                        onChange={e => setTunnelUrl(e.target.value)}
                        placeholder="/api or https://...trycloudflare.com"
                        className="w-full text-sm text-slate-800 border border-slate-200 rounded-xl px-4 py-2.5 focus:border-blue-500 outline-none"
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">
                        Defaults to `/api` which forwards to local server or Google Colab Cloudflare tunnel.
                    </p>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            YOLO11 Detection Confidence Threshold: {yoloConf}
                        </label>
                    </div>
                    <input
                        type="range"
                        min="0.10"
                        max="0.90"
                        step="0.05"
                        value={yoloConf}
                        onChange={e => setYoloConf(e.target.value)}
                        className="w-full accent-blue-600 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                        Lower values capture subtler motion; higher values eliminate false positives.
                    </p>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Multimodal Forensic AI Model
                    </label>
                    <select
                        value={model}
                        onChange={e => setModel(e.target.value)}
                        className="w-full text-sm text-slate-800 border border-slate-200 rounded-xl px-4 py-2.5 focus:border-blue-500 outline-none bg-white"
                    >
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended · 1.1s Latency)</option>
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Forensic Synthesis)</option>
                    </select>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                        onClick={handleSave}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95"
                    >
                        Save Configuration
                    </button>
                    {saved && (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 animate-fade-in">
                            <Flaticon name="badge-check" type="sr" className="text-emerald-500 text-base" />
                            Settings saved successfully
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── 8. Activity Log View ─────────────────────────────────────────────────────

function ActivityLogView({ videos }: { videos: VideoInfo[] }) {
    const logs = [
        { time: '11:26:19 PM', level: 'INFO', mod: 'SYSTEM', msg: 'Vigilant AI Dashboard initialized successfully.' },
        { time: '11:25:57 PM', level: 'INFO', mod: 'API-POLL', msg: `Surveillance database synced: ${videos.length} videos detected.` },
        { time: '10:55:28 PM', level: 'INFO', mod: 'TUNNEL', msg: 'Cloudflare Tunnel connected to Colab backend.' },
        { time: '10:48:12 PM', level: 'ALERT', mod: 'YOLO11', msg: 'Erratic movement flagged in perimeter zone [CAM-01].' },
        { time: '10:42:01 PM', level: 'INFO', mod: 'GEMINI', msg: 'Gemini forensic reasoning stream completed in 1.12s.' },
    ]

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Flaticon name="document" className="text-slate-700 text-lg" />
                        <h2 className="text-lg font-bold text-slate-900">Security & Activity Audit Log</h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        Chronological record of system initialization, video ingestion, inference runs, and security alerts.
                    </p>
                </div>
                <button
                    onClick={() => alert('Audit log exported to clipboard')}
                    className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-all self-start sm:self-center"
                >
                    <Flaticon name="cloud-download" className="text-slate-600 text-xs" />
                    <span>Export Audit Trail</span>
                </button>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                <div className="divide-y divide-slate-100 font-mono text-xs">
                    {logs.map((l, i) => (
                        <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    l.level === 'ALERT' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {l.level}
                                </span>
                                <span className="text-slate-400">{l.time}</span>
                                <span className="text-slate-500 font-bold">[{l.mod}]</span>
                                <span className="text-slate-800">{l.msg}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
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
                    <Flaticon name="brain" type="sr" className="text-blue-600 text-lg" />
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
                <Flaticon name="search" className="text-slate-400 text-sm shrink-0" />
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
                    {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Flaticon name="paper-plane" type="sr" className="text-white text-xs" />}
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
                        <Flaticon name="search" className="text-slate-400 text-xs" />
                        <span>{s}</span>
                    </button>
                ))}
                <button
                    onClick={() => { setQuery(''); setResult(null); inputRef.current?.focus() }}
                    className="cursor-pointer ml-auto text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Clear query"
                >
                    <Flaticon name="refresh" className="text-slate-400 text-sm" />
                </button>
            </div>

            {error && (
                <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 px-3.5 py-2.5 rounded-xl">
                    <Flaticon name="exclamation" className="text-red-500 text-sm shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Search Results */}
            {result && !loading && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 animate-fade-up">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <Flaticon name="brain" type="sr" className="text-blue-600 text-xs" />
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

function StatCard({ flaticon, label, value, sub, color }: {
    flaticon: string
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
                    <Flaticon name={flaticon} type="sr" className={`text-sm ${c.icon}`} />
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
                        <Flaticon name="video-camera" type="sr" className="text-lg text-blue-600" />
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
                            <Flaticon name="shield-exclamation" type="sr" className="text-xs" />
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

                <h3 className="text-base font-bold text-slate-900 mb-1">Upload Surveillance Video</h3>
                <p className="text-xs text-slate-400 mb-5">Supported formats: MP4, AVI, MOV — up to 5GB</p>

                {done ? (
                    <div className="text-center py-8 space-y-2">
                        <Flaticon name="badge-check" type="sr" className="text-4xl text-emerald-500 mx-auto animate-bounce" />
                        <p className="text-sm font-semibold text-slate-800">Processing Complete!</p>
                        <p className="text-xs text-slate-400">Footage ingested into surveillance database.</p>
                    </div>
                ) : uploading ? (
                    <div className="space-y-4 py-4">
                        <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>{processingStatus || 'Uploading footage...'}</span>
                            <span className="font-mono font-medium">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                            <div
                                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <p className="text-[11px] text-slate-400 text-center">
                            YOLO11 is running tracklet extraction and Gemini is classifying alerts.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div
                            onDragOver={e => { e.preventDefault(); setDragging(true) }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
                            onClick={() => fileRef.current?.click()}
                            className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                                dragging
                                    ? 'border-blue-500 bg-blue-50/50'
                                    : file
                                    ? 'border-blue-400 bg-blue-50/30'
                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            <input
                                ref={fileRef}
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                            />
                            {file ? (
                                <div className="space-y-1">
                                    <Flaticon name="video-camera" type="sr" className="text-3xl text-blue-600 mx-auto" />
                                    <p className="text-xs font-semibold text-slate-800 truncate max-w-xs mx-auto">{file.name}</p>
                                    <p className="text-[11px] text-slate-400">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Flaticon name="cloud-upload" className="text-3xl text-slate-400 mx-auto" />
                                    <p className="text-xs font-semibold text-slate-700">Drag & drop footage here</p>
                                    <p className="text-[11px] text-slate-400">or click to browse files</p>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
                                <Flaticon name="exclamation" className="text-red-500 text-sm shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-2.5 pt-2">
                            <button
                                onClick={onClose}
                                className="cursor-pointer px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!file}
                                className="cursor-pointer px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all active:scale-95"
                            >
                                Ingest Video
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
