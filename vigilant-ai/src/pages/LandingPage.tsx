import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flaticon } from '../components/Flaticon'

export default function LandingPage() {
    const navigate = useNavigate()

    // Interactive Hero Prompts State
    const [heroPromptIdx, setHeroPromptIdx] = useState(0)
    const HERO_PROMPTS = [
        {
            q: "What is happening at the entrance?",
            answer: "A person is detected at the entrance near the glass door. The person is carrying a backpack and appears to be entering the building. No unusual activity detected.",
            cam: "Entrance · Cam 03",
            time: "Today, 10:24 AM",
            img: "/cam-entrance.jpg",
            tag: "PERSON DETECTED",
            hasBox: true
        },
        {
            q: "Any unusual activity?",
            answer: "All 4 active camera sectors operating within standard security baselines. No perimeter breaches, loitering, or erratic movement detected in the past 60 minutes.",
            cam: "All Feeds (200+ online)",
            time: "Today, 10:25 AM",
            img: "/cam-loading.jpg",
            tag: "ALL CLEAR",
            hasBox: false
        },
        {
            q: "How many people are in the parking lot?",
            answer: "0 pedestrians currently detected in Zone B. 2 delivery fleet vehicles stationary in marked bays with hazard lights disengaged.",
            cam: "Parking Lot · Cam 02",
            time: "Today, 10:26 AM",
            img: "/cam-parking.jpg",
            tag: "FLEET DETECTED",
            hasBox: false
        },
        {
            q: "Show me recent alerts",
            answer: "0 critical escalations. One scheduled forklift logistics movement logged at Warehouse Bay 01 (10:15 AM). Shift transition normal.",
            cam: "System Sentinel",
            time: "Today, 10:27 AM",
            img: "/cam-warehouse.jpg",
            tag: "LOGISTICS EVENT",
            hasBox: false
        }
    ]

    // Interactive Sandbox Queries
    const [selectedQuery, setSelectedQuery] = useState(0)
    const DEMO_QUERIES = [
        {
            q: "Show anyone climbing or crawling near the entrance after midnight",
            badge: "STAGE C · CRITICAL",
            badgeCls: "bg-red-50 text-red-600 border-red-200",
            time: "00:14 – 00:26",
            cam: "CAM-01 · North Entrance",
            synopsis: "Subject observed crawling low along perimeter floor towards service entrance. Behavioral telemetry flagged evasive posture and erratic motion pattern.",
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
            synopsis: "Silver delivery van idling in designated red zone with hazard lights inactive. Spatial dwell telemetry logged 8-minute stationary duration.",
            intent: "parking_violation",
            matchScore: 91.0
        }
    ]

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                    {/* Brand */}
                    <div
                        onClick={() => navigate('/')}
                        className="cursor-pointer flex items-center gap-2.5 group"
                    >
                        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs group-hover:border-blue-400 transition-colors">
                            <Flaticon name="shield-check" type="sr" className="text-xl text-blue-600" />
                        </div>
                        <span className="text-lg font-bold text-slate-900 tracking-tight">
                            Vigilant AI
                        </span>
                    </div>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
                        <a href="#home" className="text-blue-600 font-semibold relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-blue-600">
                            Home
                        </a>
                        <a href="#features" className="hover:text-blue-600 transition-colors py-1">
                            Features
                        </a>
                        <a href="#capabilities" className="hover:text-blue-600 transition-colors py-1 flex items-center gap-1">
                            <span>Solutions</span>
                            <Flaticon name="angle-small-down" className="text-xs" />
                        </a>
                        <a href="#architecture" className="hover:text-blue-600 transition-colors py-1">
                            Pricing
                        </a>
                        <a href="#demo" className="hover:text-blue-600 transition-colors py-1 flex items-center gap-1">
                            <span>Resources</span>
                            <Flaticon name="angle-small-down" className="text-xs" />
                        </a>
                    </nav>

                    {/* Header Action Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="cursor-pointer hidden sm:flex items-center px-4.5 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="cursor-pointer flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-xs transition-all active:scale-95"
                        >
                            <span>Get Started</span>
                            <Flaticon name="arrow-small-right" className="text-sm" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section id="home" className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
                {/* Ambient Soft Blue Radial Glow */}
                <div className="absolute top-0 right-0 -mr-40 -mt-20 w-[680px] h-[680px] bg-gradient-to-bl from-blue-200/40 via-sky-100/25 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
                <div className="absolute bottom-10 left-10 w-[420px] h-[420px] bg-gradient-to-tr from-blue-100/30 via-indigo-50/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                        {/* Left Column: Headline & Value Proposition */}
                        <div className="lg:col-span-5 space-y-6 text-left">
                            {/* Category Pill */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Enterprise-Grade AI Surveillance</span>
                            </div>

                            {/* Main Headline */}
                            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                                Hundreds of Cameras.<br />
                                Real Insights.<br />
                                <span className="text-blue-600">In Real Time.</span>
                            </h1>

                            {/* Subtitle */}
                            <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal max-w-lg">
                                Vigilant AI monitors your cameras using advanced ML and reasoning models — not just to detect objects, but to understand what's actually happening. Ask questions in plain English and get instant, accurate answers.
                            </p>

                            {/* Action Buttons */}
                            <div className="pt-2 flex flex-wrap items-center gap-3.5">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="cursor-pointer px-6 py-3 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition-all flex items-center gap-2 active:scale-95"
                                >
                                    <span>Get Started Free</span>
                                    <Flaticon name="arrow-small-right" className="text-base" />
                                </button>
                                <button
                                    onClick={() => {
                                        const el = document.getElementById('demo')
                                        el?.scrollIntoView({ behavior: 'smooth' })
                                    }}
                                    className="cursor-pointer px-6 py-3 rounded-full text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all flex items-center gap-2"
                                >
                                    <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] pl-0.5">
                                        ▶
                                    </div>
                                    <span>Watch Demo</span>
                                </button>
                            </div>

                            {/* 3 Micro Feature Indicators */}
                            <div className="pt-6 grid grid-cols-3 gap-3 border-t border-slate-200/80">
                                <div className="flex items-start gap-2.5">
                                    <div className="text-blue-600 text-base mt-0.5">
                                        <Flaticon name="display" className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 leading-tight">100s of Cameras</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">One intelligent platform</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <div className="text-blue-600 text-base mt-0.5">
                                        <Flaticon name="brain" type="sr" className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 leading-tight">Reasoning AI</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">Understand, not just detect</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <div className="text-blue-600 text-base mt-0.5">
                                        <Flaticon name="comment-alt-dots" className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 leading-tight">Natural Language</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">Ask anything, get answers</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: 3D Angled Perspective Dashboard Mockup */}
                        <div className="lg:col-span-7 relative">
                            {/* Glowing backdrop halo */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-300/30 via-indigo-200/20 to-sky-100/10 rounded-3xl blur-2xl -z-10 pointer-events-none" />

                            {/* 3D Perspective Wrapper */}
                            <div
                                className="w-full transition-transform duration-500 hover:rotate-0"
                                style={{
                                    transform: 'perspective(1400px) rotateY(-7deg) rotateX(3deg)',
                                    transformStyle: 'preserve-3d'
                                }}
                            >
                                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden text-left">
                                    {/* Mockup Top Header */}
                                    <div className="px-4 py-3 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center">
                                                    <Flaticon name="shield-check" type="sr" className="text-xs text-white" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-900">Vigilant AI</span>
                                            </div>
                                            <div className="hidden sm:flex items-center gap-2 pl-2">
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    <span>Live</span>
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    <span>200+ cameras online</span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">
                                                <Flaticon name="bell" className="text-slate-600" />
                                            </div>
                                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                                                PK
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mockup Interior Grid: Sidebar + Live Monitoring + Ask AI */}
                                    <div className="grid grid-cols-12 min-h-[380px]">
                                        {/* Mini Mockup Sidebar (2 cols) */}
                                        <div className="col-span-2 border-r border-slate-100 p-2.5 space-y-1 hidden sm:block bg-white">
                                            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs">
                                                <Flaticon name="apps" className="text-xs" />
                                                <span>Dashboard</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 text-xs">
                                                <Flaticon name="video-camera" className="text-xs text-slate-400" />
                                                <span>Cameras</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 text-xs">
                                                <Flaticon name="triangle-warning" className="text-xs text-slate-400" />
                                                <span>Incidents</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 text-xs">
                                                <Flaticon name="chart-histogram" className="text-xs text-slate-400" />
                                                <span>Reports</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 text-xs">
                                                <Flaticon name="settings" className="text-xs text-slate-400" />
                                                <span>Settings</span>
                                            </div>
                                        </div>

                                        {/* Live Monitoring (5 cols on lg) */}
                                        <div className="col-span-12 sm:col-span-6 lg:col-span-5 p-3 border-r border-slate-100 space-y-2.5 bg-slate-50/30">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-slate-900">Live Monitoring</span>
                                                <button
                                                    onClick={() => navigate('/dashboard')}
                                                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                                                >
                                                    <span>View All</span>
                                                    <Flaticon name="arrow-small-right" className="text-[10px]" />
                                                </button>
                                            </div>

                                            {/* 2x2 Camera Feed Grid */}
                                            <div className="grid grid-cols-2 gap-2">
                                                {/* Cam 1: Warehouse */}
                                                <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-video group">
                                                    <img
                                                        src="/cam-warehouse.jpg"
                                                        alt="Warehouse Cam 01"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    <div className="absolute top-1 left-1 flex items-center gap-1 bg-slate-900/80 backdrop-blur-xs px-1.5 py-0.5 rounded text-[8px] text-white font-mono">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                        <span>Warehouse · Cam 01</span>
                                                    </div>
                                                </div>

                                                {/* Cam 2: Parking Lot */}
                                                <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-video group">
                                                    <img
                                                        src="/cam-parking.jpg"
                                                        alt="Parking Lot Cam 02"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    <div className="absolute top-1 left-1 flex items-center gap-1 bg-slate-900/80 backdrop-blur-xs px-1.5 py-0.5 rounded text-[8px] text-white font-mono">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                        <span>Parking Lot · Cam 02</span>
                                                    </div>
                                                </div>

                                                {/* Cam 3: Entrance (With Active AI Bounding Box) */}
                                                <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-video group">
                                                    <img
                                                        src="/cam-entrance.jpg"
                                                        alt="Entrance Cam 03"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    {/* AI Bounding Box overlay */}
                                                    <div className="absolute inset-y-[20%] inset-x-[36%] border-2 border-red-500 rounded-xs pointer-events-none animate-pulse">
                                                        <div className="absolute -top-3 left-0 bg-red-600 text-white text-[7px] font-mono px-1 py-0.2 rounded font-bold">
                                                            PERSON 98%
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-1 left-1 flex items-center gap-1 bg-slate-900/80 backdrop-blur-xs px-1.5 py-0.5 rounded text-[8px] text-white font-mono">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                                                        <span>Entrance · Cam 03</span>
                                                    </div>
                                                </div>

                                                {/* Cam 4: Loading Dock */}
                                                <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-video group">
                                                    <img
                                                        src="/cam-loading.jpg"
                                                        alt="Loading Dock Cam 04"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    <div className="absolute top-1 left-1 flex items-center gap-1 bg-slate-900/80 backdrop-blur-xs px-1.5 py-0.5 rounded text-[8px] text-white font-mono">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                        <span>Loading Dock · Cam 04</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ask Vigilant AI Panel (5 cols) */}
                                        <div className="col-span-12 sm:col-span-6 lg:col-span-5 p-3 flex flex-col justify-between space-y-2.5 bg-white">
                                            <div className="space-y-2.5">
                                                {/* Panel Title */}
                                                <div className="flex items-center gap-1.5">
                                                    <Flaticon name="sparkles" className="text-blue-600 text-xs" />
                                                    <span className="text-xs font-bold text-slate-900">Ask Vigilant AI</span>
                                                </div>

                                                {/* User Query Bubble */}
                                                <div className="bg-slate-100 rounded-xl px-3 py-2 flex items-center justify-between text-xs text-slate-800">
                                                    <span className="font-medium text-[11px] leading-tight">
                                                        {HERO_PROMPTS[heroPromptIdx].q}
                                                    </span>
                                                    <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0 ml-2">
                                                        <Flaticon name="arrow-small-right" className="text-xs" />
                                                    </div>
                                                </div>

                                                {/* AI Response Card */}
                                                <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50/60 space-y-2 text-left">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center text-[8px]">
                                                            <Flaticon name="shield-check" type="sr" className="text-[9px] text-white" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-800">Vigilant Intelligence</span>
                                                        <span className="text-[9px] font-mono text-slate-400 ml-auto">
                                                            {HERO_PROMPTS[heroPromptIdx].time}
                                                        </span>
                                                    </div>

                                                    <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                                                        {HERO_PROMPTS[heroPromptIdx].answer}
                                                    </p>

                                                    {/* Detection Thumbnail Crop */}
                                                    <div className="relative rounded-lg overflow-hidden border border-slate-200 h-20 w-full bg-slate-900">
                                                        <img
                                                            src={HERO_PROMPTS[heroPromptIdx].img}
                                                            alt="Event crop"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {HERO_PROMPTS[heroPromptIdx].hasBox && (
                                                            <div className="absolute inset-y-[15%] inset-x-[38%] border-2 border-red-500 rounded-xs pointer-events-none">
                                                                <span className="absolute -top-3 left-0 bg-red-600 text-white text-[7px] font-mono px-1 py-0.2 rounded font-bold">
                                                                    PERSON 98%
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="absolute bottom-1 left-1 bg-slate-900/80 px-1.5 py-0.5 rounded text-[8px] text-white font-mono">
                                                            {HERO_PROMPTS[heroPromptIdx].cam}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quick Prompt Suggestions */}
                                            <div className="space-y-1.5 pt-1">
                                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                                                    Interactive Queries:
                                                </span>
                                                <div className="flex flex-wrap gap-1">
                                                    {HERO_PROMPTS.map((item, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setHeroPromptIdx(idx)}
                                                            className={`cursor-pointer px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                                                                heroPromptIdx === idx
                                                                    ? 'bg-blue-600 text-white shadow-xs'
                                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                            }`}
                                                        >
                                                            {item.q}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Value Props Bar (Directly beneath Hero) */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20">
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:divide-x lg:divide-slate-200/80">
                        {/* 1. Smarter Detection */}
                        <div className="flex items-start gap-3.5 lg:pr-6 text-left">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <Flaticon name="crosshair" className="text-lg text-blue-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 leading-snug">Smarter Detection</h4>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Identifies objects, behaviours and context — not just movement.
                                </p>
                            </div>
                        </div>

                        {/* 2. Reasoning AI */}
                        <div className="flex items-start gap-3.5 lg:px-6 text-left">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <Flaticon name="brain" type="sr" className="text-lg text-blue-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 leading-snug">Reasoning AI</h4>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Understands what's happening and why it matters.
                                </p>
                            </div>
                        </div>

                        {/* 3. Natural Language Queries */}
                        <div className="flex items-start gap-3.5 lg:px-6 text-left">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <Flaticon name="comment-alt-dots" className="text-lg text-blue-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 leading-snug">Natural Language Queries</h4>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Ask questions in plain English and get real-time answers.
                                </p>
                            </div>
                        </div>

                        {/* 4. Built for Enterprise */}
                        <div className="flex items-start gap-3.5 lg:pl-6 text-left">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <Flaticon name="shield-check" type="sr" className="text-lg text-blue-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 leading-snug">Built for Enterprise</h4>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Secure, scalable and reliable for large-scale deployments.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Problem: Modern Camera Blindspot */}
            <section id="features" className="py-16 md:py-24 bg-white border-y border-slate-200/80">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                            THE SURVEILLANCE PARADOX
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            More Cameras Do Not Mean More Safety.
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                            A single human security operator monitoring 12 CCTV screens misses over 95% of subtle motion events after just 22 minutes. Modern security infrastructure records blindly into cold storage.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch text-left">
                        {/* Legacy Way */}
                        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                                    ✕
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Legacy CCTV (Passive Storage)</h3>
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
                                    <span><strong>Vigilance Fatigue:</strong> Human attention decays steeply, letting critical intrusions pass unseen.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Vigilant AI Way */}
                        <div className="bg-blue-50/50 border border-blue-200/80 rounded-3xl p-6 sm:p-8 space-y-5 relative overflow-hidden">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                                    ✓
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Vigilant AI (Autonomous Sentinel Stream)</h3>
                                    <p className="text-xs text-blue-600 font-medium">Continuous real-time visual perception + cognitive intelligence</p>
                                </div>
                            </div>
                            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                                <li className="flex items-start gap-2.5">
                                    <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
                                    <span><strong>Instant Threat Triage:</strong> Sub-millisecond neural tracking extracts movement vectors, escalating high-priority threats instantly.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
                                    <span><strong>Natural Language Query:</strong> Search 100s of hours of footage in plain English with instant timecoded visual proof.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
                                    <span><strong>Multimodal Behavioral Reasoning:</strong> Deep visual intelligence distinguishes benign actions from stealth, theft, or altercations.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
                                    <span><strong>Court-Ready Forensic Reports:</strong> Auto-generate chronological PDF incident dossiers in 1 click.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Capabilities Bento */}
            <section id="capabilities" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                        PRODUCT PILLARS
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Built for Modern High-Density Security.
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        Combining high-throughput edge computer vision with deep cognitive visual intelligence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
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
                                Hardware-accelerated tracking engines process 50+ FPS directly on stream, continuously calculating velocity vectors, spatial bounding boxes, and perimeter dwell times.
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
                                Cognitive vision models analyze behavioral nuance—differentiating between routine staff movements versus suspicious, evasive, or high-risk actions.
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-[11px] font-mono text-slate-600 flex items-center justify-between">
                            <span>Verification Logic:</span>
                            <span className="text-indigo-600 font-bold">Multi-Stage Consensus</span>
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
                                High-dimensional semantic indexing maps visual keyframes and natural language into a unified vector space for sub-second search across distributed feeds.
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
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
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
                                className={`cursor-pointer px-4.5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all border ${
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
                        <div className="bg-[#F8FAFC] border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 text-left animate-fade-in">
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
                                    <Flaticon name="arrow-small-right" className="text-xs" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Architecture Overview */}
            <section id="architecture" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                        HIERARCHICAL ENGINE
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Pyramid of Compute: How We Process at Scale
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        Heavy foundation models cannot run on 30 FPS raw video. Vigilant AI cascades compute across 4 layers to maintain real-time speed at fraction of cloud cost.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">Layer 1 · CPU</span>
                        <h4 className="text-sm font-bold text-slate-900">Motion Slicing</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Frame differencing optical velocity drops 75% of static, empty footage before touching neural inference.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 uppercase">Layer 2 · Edge Neural</span>
                        <h4 className="text-sm font-bold text-slate-900">Spatial Perception</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Extracts spatial bounding boxes, entity counts, and velocity vectors at 50+ FPS real-time.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-600 uppercase">Layer 3 · Vector Index</span>
                        <h4 className="text-sm font-bold text-slate-900">Semantic Embeddings</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Encodes keyframes into high-density vectors stored for sub-50ms cosine similarity natural language search.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 uppercase">Layer 4 · Cognitive Core</span>
                        <h4 className="text-sm font-bold text-slate-900">Behavioral Reasoning</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Synthesizes forensic narrative, confirms suspicious intent, and categorizes high-priority threat levels.
                        </p>
                    </div>
                </div>
            </section>

            {/* Bottom Call to Action Banner */}
            <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50/60 border-t border-slate-200/80 text-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Transform Your Camera Network Into Autonomous Intelligence.
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                        Ready to see how Vigilant AI monitors surveillance footage without human fatigue? Launch the live console or test compute benchmarks.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-md transition-all active:scale-95"
                        >
                            <span>Get Started Free</span>
                            <Flaticon name="arrow-small-right" className="text-sm" />
                        </button>
                        <button
                            onClick={() => navigate('/benchmarks')}
                            className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-xs transition-all"
                        >
                            <Flaticon name="stats" className="text-slate-500 text-xs" />
                            <span>System Compute Benchmarks</span>
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
                        <a href="#features" className="hover:text-blue-600">Features</a>
                        <a href="#architecture" className="hover:text-blue-600">Architecture</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
