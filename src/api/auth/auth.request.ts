import { api } from '../api'
import { tokenStorage } from '../tokenStorage'
import type {
    RegisterUserDTO,
    LoginDTO,
    AuthResponseDTO,
    RefreshTokenDTO,
    LogoutDTO,
} from '../../types/authDTOs'

export const authRequests = {
    async register(dto: RegisterUserDTO) {
        const res = await api.post<AuthResponseDTO>('/auth/register', dto)
        tokenStorage.setAccess(res.data.accessToken)
        tokenStorage.setRefresh(res.data.refreshToken)
        return res.data
    },

    async login(dto: LoginDTO) {
        const res = await api.post<AuthResponseDTO>('/auth/login', dto)
        tokenStorage.setAccess(res.data.accessToken)
        tokenStorage.setRefresh(res.data.refreshToken)
        return res.data
    },

    async refresh(dto?: RefreshTokenDTO) {
        const res = await api.post<AuthResponseDTO>('/auth/refresh', dto ?? {})
        tokenStorage.setAccess(res.data.accessToken)
        if (res.data.refreshToken) tokenStorage.setRefresh(res.data.refreshToken)
        return res.data
    },

    async logout(dto?: LogoutDTO) {
        const refreshToken = tokenStorage.getRefresh()
        const payload = dto ?? (refreshToken ? ({ refreshToken } as LogoutDTO) : ({} as any))

        const res = await api.post('/auth/logout', payload)
        tokenStorage.clear()
        return res.data
    },
}