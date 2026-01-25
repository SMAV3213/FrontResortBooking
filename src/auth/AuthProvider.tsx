import React from 'react'
import { authRequests, tokenStorage, userRequests } from '../api'
import type { ERole, UserDTO } from '../types/userDTOs'
import type { LoginDTO, RegisterUserDTO } from '../types/authDTOs'
import { decodeJwt, getRoleFromJwt, getUserIdFromJwt } from './jwt'
import { parseRole } from './role'

type AuthContextValue = {
  token: string | null
  user: UserDTO | null
  isAuth: boolean
  role: ERole | null
  ready: boolean
  login: (dto: LoginDTO) => Promise<void>
  register: (dto: RegisterUserDTO) => Promise<void>
  logout: () => Promise<void>
  refreshMe: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = React.useState<string | null>(() => tokenStorage.getAccess())
  const [user, setUser] = React.useState<UserDTO | null>(null)
  const [ready, setReady] = React.useState(false)

  const payload = React.useMemo(() => (token ? decodeJwt(token) : null), [token])
  const roleFromToken = parseRole(getRoleFromJwt(payload))
  const role = user?.role ?? roleFromToken
  const isAuth = Boolean(token)

  const refreshMe = React.useCallback(async () => {
    try {
      const t = tokenStorage.getAccess()
      if (!t) {
        setToken(null)
        setUser(null)
        return
      }

      setToken(t)

      const p = decodeJwt(t)
      const userId = getUserIdFromJwt(p)

      if (userId) {
        const u = await userRequests.getById(userId) // тут роль уже нормализована
        setUser(u)
      }
    } finally {
      setReady(true)
    }
  }, [])

  React.useEffect(() => {
    refreshMe()
  }, [refreshMe])

  const login = async (dto: LoginDTO) => {
    const res = await authRequests.login(dto)
    tokenStorage.setAccess(res.accessToken)
    tokenStorage.setRefresh(res.refreshToken)
    await refreshMe()
  }

  const register = async (dto: RegisterUserDTO) => {
    const res = await authRequests.register(dto)
    tokenStorage.setAccess(res.accessToken)
    tokenStorage.setRefresh(res.refreshToken)
    await refreshMe()
  }

  const logout = async () => {
    try {
      await authRequests.logout({ refreshToken: tokenStorage.getRefresh() ?? '' })
    } finally {
      tokenStorage.clear()
      setToken(null)
      setUser(null)
      setReady(true)
    }
  }

  const value: AuthContextValue = {
    token,
    user,
    isAuth,
    role: role ?? null,
    ready,
    login,
    register,
    logout,
    refreshMe,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}