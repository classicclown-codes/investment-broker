import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login({ mode = 'login' }) {
  const isSignup = mode === 'signup'
  const isAdminMode = mode === 'admin'
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const from = location.state?.from?.pathname || (isAdminMode ? '/admin' : '/dashboard')

  const title = isAdminMode
    ? 'Admin portal login'
    : isSignup
    ? 'Open a client account'
    : 'Secure client login'

  const description = isAdminMode
    ? 'Authorized administrators sign in to manage private client portfolios and account workflows.'
    : isSignup
    ? 'Create your secure portal access before starting onboarding.'
    : 'Sign in to manage your portfolio, view performance, and submit new investment requests.'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    const result = isSignup
      ? await auth.signup({ email, password, fullName })
      : await auth.signin({ email, password })

    if (!result.ok) {
      setError(result.error || 'Authentication failed')
      return
    }

    if (result.needsConfirmation) {
      setMessage('Account created. Check your email to confirm your login before continuing.')
      return
    }

    const signedInUser = result.user || auth.user

    if (isAdminMode && !signedInUser?.isAdmin) {
      await auth.signout()
      setError('Admin access is required for this portal.')
      return
    }

    const destination = isAdminMode ? '/admin' : signedInUser?.isAdmin && from !== '/admin' ? '/admin' : from
    navigate(destination, { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#090705] px-4 py-6 text-[#f2e9c8] sm:px-6 sm:py-10 flex items-center justify-center">
      <div className="w-full max-w-md surface-card p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <div className="mb-6">
          <div className="mb-2 text-[0.68rem] uppercase tracking-[0.28em] text-muted sm:text-xs sm:tracking-[0.35em]">Aurum Capital</div>
          <h2 className="text-2xl font-semibold text-[#f7e9c8] sm:text-3xl">{title}</h2>
          <p className="text-sm text-[#b3a37d] mt-2">{description}</p>
        </div>

        {!auth.isSupabaseConfigured && (
          <div className="mb-4 surface-panel px-4 py-3 text-sm text-[#f0c39b]">
            Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your environment to enable authentication.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-xs uppercase text-muted mb-2">Full name</label>
              <input
                className="w-full rounded-2xl border border-[#2a2016] bg-[#0d0a06] px-4 py-3 text-[#f0e6d0] focus:border-[#d4b05f] focus:ring-[1px] focus:ring-[#d4b05f]/20"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-xs uppercase text-muted mb-2">Email address</label>
            <input
              type="email"
              className="w-full rounded-2xl border border-[#2a2016] bg-[#0d0a06] px-4 py-3 text-[#f0e6d0] focus:border-[#d4b05f] focus:ring-[1px] focus:ring-[#d4b05f]/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-muted mb-2">Password</label>
            <input
              type="password"
              className="w-full rounded-2xl border border-[#2a2016] bg-[#0d0a06] px-4 py-3 text-[#f0e6d0] focus:border-[#d4b05f] focus:ring-[1px] focus:ring-[#d4b05f]/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              minLength={6}
              required
            />
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          {message && <div className="text-[#d4b05f] text-sm">{message}</div>}
          <button
            type="submit"
            disabled={auth.loading || !auth.isSupabaseConfigured}
            className="brand-button w-full rounded-2xl px-4 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSignup ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <div className="mt-5 text-sm text-center text-muted">
          {isAdminMode ? 'Not an admin? ' : isSignup ? 'Already approved? ' : 'New client? '}
          <Link
            to={isAdminMode ? '/login' : isSignup ? '/login' : '/signup'}
            className="text-[#d4b05f] hover:text-[#e8cc7b]"
          >
            {isAdminMode ? 'Client login' : isSignup ? 'Sign in' : 'Create an account'}
          </Link>
        </div>
        <div className="mt-4 text-sm text-center">
          <Link to="/" className="text-[#d4b05f] hover:text-[#e8cc7b]">Back to home</Link>
        </div>
      </div>
    </div>
  )
}
