import React from 'react'
import { authRequests, tokenStorage, userRequests } from '../api'
import type { ERole, UserDTO } from '../types/userDTOs'
import type { LoginDTO, RegisterUserDTO } from '../types/authDTOs'
import { decodeJwt, getRoleFromJwt, getUserIdFromJwt } from './jwt'

type AuthContextValue = {
    token: string | null
    user: UserDTO | null
    isAuth: boolean
    role: ERole | null
    login: (dto: LoginDTO) => Promise<void>
    register: (dto: RegisterUserDTO) => Promise<void>
    logout: () => Promise<void>
    refreshMe: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

const roleStringToEnum = (role: string | null): ERole | null => {
    if (!role) return null
    if (role.toLowerCase() === 'admin') return 1 as ERole
    if (role.toLowerCase() === 'user') return 0 as ERole
    const n = Number(role)
    if (Number.isFinite(n)) return n as ERole
    return null
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [token, setToken] = React.useState<string | null>(() => tokenStorage.getAccess())
    const [user, setUser] = React.useState<UserDTO | null>(null)

    const role = user?.role ?? roleStringToEnum(getRoleFromJwt(decodeJwt(token ?? '') ?? null))
    const isAuth = Boolean(token)

    const refreshMe = React.useCallback(async () => {
        const t = tokenStorage.getAccess()
        if (!t) {
            setToken(null)
            setUser(null)
            return
        }

        setToken(t)

        const payload = decodeJwt(t)
        const userId = getUserIdFromJwt(payload)

        if (userId) {
            const u = await userRequests.getById(userId)
            setUser(u)
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
        }
    }

    const value: AuthContextValue = { token, user, isAuth, role: role ?? null, login, register, logout, refreshMe }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const ctx = React.useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}