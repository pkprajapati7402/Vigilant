import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import VideoPage from './pages/VideoPage'
import BenchmarkPage from './pages/BenchmarkPage'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/console" element={<Navigate to="/dashboard" replace />} />
        <Route path="/video/:videoId" element={<VideoPage />} />
        <Route path="/benchmarks" element={<BenchmarkPage />} />
      </Routes>
    </BrowserRouter>
  )
}
