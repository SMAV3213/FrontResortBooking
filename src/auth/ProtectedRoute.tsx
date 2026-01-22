import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { ERole } from '../types/userDTOs'
import { useAuth } from './AuthProvider'

type Props = {
  role?: ERole 
}

const ProtectedRoute: React.FC<Props> = ({ role }) => {
  const { isAuth, user } = useAuth()
  const loc = useLocation()

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  }

  if (role !== undefined && user?.role !== role) {
    return <Navigate to="/forbidden" replace />
  }

  return <Outlet />
}

export default ProtectedRoute