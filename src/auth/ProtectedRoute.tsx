import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { ERole } from '../types/userDTOs'
import { useAuth } from './AuthProvider'

type Props = { role?: ERole }

const ProtectedRoute: React.FC<Props> = ({ role: requiredRole }) => {
  const { isAuth, role, ready } = useAuth()
  const loc = useLocation()

  if (!ready) return null 

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  }

  if (requiredRole !== undefined && role !== requiredRole) {
    return <Navigate to="/forbidden" replace />
  }

  return <Outlet />
}

export default ProtectedRoute