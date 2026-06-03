import React, { createContext, useContext, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

const adminEmails = import.meta.env.VITE_ADMIN_EMAILS
  ? import.meta.env.VITE_ADMIN_EMAILS.split(',').map((email) => email.trim().toLowerCase())
  : []

function normalizeUser(user) {
  if (!user) return null

  const email = user.email?.toLowerCase()
  const isAdmin = Boolean(
    user.user_metadata?.role === 'admin' ||
    (email && adminEmails.includes(email))
  )

  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
    picture: user.user_metadata?.avatar_url || user.user_metadata?.picture,
    provider: user.app_metadata?.provider || 'email',
    isAdmin,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return undefined
    }

    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setUser(normalizeUser(data.session?.user))
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(normalizeUser(session?.user))
      setLoading(false)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const signin = async ({ email, password }) => {
    if (!isSupabaseConfigured) {
      return { ok: false, error: 'Supabase is not configured yet.' }
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      setUser(normalizeUser(data.user))
      return { ok: true }
    } catch (error) {
      setUser(null)
      return { ok: false, error: error.message || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const signup = async ({ email, password, fullName }) => {
    if (!isSupabaseConfigured) {
      return { ok: false, error: 'Supabase is not configured yet.' }
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
      setUser(normalizeUser(data.user))
      return { ok: true, needsConfirmation: !data.session }
    } catch (error) {
      return { ok: false, error: error.message || 'Signup failed' }
    } finally {
      setLoading(false)
    }
  }

  const signout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signin, signup, signout, isSupabaseConfigured, isAdmin: user?.isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
