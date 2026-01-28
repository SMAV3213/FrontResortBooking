import { api } from '../api'
import type { UserDTO, ERole } from '../../types/userDTOs'
import type { PagedResult } from '../paged'

export type UsersQuery = {
  page?: number
  pageSize?: number
  search?: string
  role?: 'Admin' | 'User'
  sortBy?: 'login' | 'email' | 'role'
  sortDir?: 'asc' | 'desc'
}

type ApiUserDTO = Omit<UserDTO, 'role'> & { role: string | number }

const parseRole = (v: unknown): ERole => {
  if (typeof v === 'number') return v as ERole
  const s = String(v).toLowerCase()
  if (s === 'admin') return 1 as ERole
  return 0 as ERole
}

const normalizeUser = (u: ApiUserDTO): UserDTO => ({
  ...u,
  role: parseRole(u.role),
})

export const userRequests = {
  async getAll(params?: any) {
    const res = await api.get<PagedResult<ApiUserDTO>>('/users', { params })
    return {
      ...res.data,
      items: res.data.items.map(normalizeUser),
    } as PagedResult<UserDTO>
  },

  async getById(id: string) {
    const res = await api.get<UserDTO>(`/users/${id}`)
    return res.data
  },

  async update(id: string, dto: { email: string; phoneNumber: string }) {
    const res = await api.put(`/users/${id}`, dto)
    return res.data
  },

  async remove(id: string) {
    const res = await api.delete(`/users/${id}`)
    return res.data
  },

  async changeRole(id: string, dto: { role: ERole }) {
    const res = await api.patch(`/users/${id}/role`, dto)
    return res.data
  },
}