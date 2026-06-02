import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import InvestmentApp from './pages/InvestmentApp'
import Login from './pages/Login'
import RequireAuth from './components/RequireAuth'
import { useAuth } from './context/AuthContext'

export default function AppRouter() {
  const auth = useAuth()
  const navLinkClass = 'rounded-xl px-3 py-2 text-center text-sm transition hover:bg-[#c8a96e]/10'
  const outlineLinkClass = 'rounded-xl border border-[#4d3d14] px-3 py-2 text-center text-sm transition hover:bg-[#c8a96e]/10'

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-20 border-b border-[#2f261a] bg-[#0d0b08]/95 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="text-center text-lg font-semibold tracking-wide text-[#f8e7b3] sm:text-left">Aurum Capital</Link>
          <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
            <Link to="/" className={navLinkClass}>Home</Link>
            <Link to="/dashboard" className={navLinkClass}>Dashboard</Link>
            <Link to="/apply" className={navLinkClass}>Apply</Link>
            {auth.user ? (
              <button onClick={auth.signout} className={`${outlineLinkClass} col-span-3 sm:col-span-1`}>Sign out</button>
            ) : (
              <>
                <Link to="/login" className={outlineLinkClass}>Sign in</Link>
                <Link to="/signup" className="col-span-2 rounded-xl bg-[#d4b05f] px-3 py-2 text-center text-sm font-semibold text-black transition hover:bg-[#e2c16f] sm:col-span-1">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-5 sm:py-8">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login mode="signup" />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/apply" element={<RequireAuth><InvestmentApp /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
