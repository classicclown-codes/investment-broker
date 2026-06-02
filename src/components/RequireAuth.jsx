import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireAuth({ children }) {
  const auth = useAuth()
  const location = useLocation()

  if (auth.loading) {
    return <div>Checking authentication...</div>
  }

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
