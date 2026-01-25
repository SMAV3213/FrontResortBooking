import { api } from '../api'
import type { UserDTO, UpdateUserDTO, ChangeUserRoleDTO } from '../../types/userDTOs'
import { parseRole } from '../../auth/role'

type ApiUserDTO = Omit<UserDTO, 'role'> & { role: string | number }

const mapUpdateUserDto = (dto: UpdateUserDTO) => ({
  email: (dto as any).email ?? (dto as any).Email,
  phoneNumber: (dto as any).phoneNumber ?? (dto as any).PhoneNumber,
})

const mapChangeRoleDto = (dto: ChangeUserRoleDTO) => ({
  role: (dto as any).role ?? (dto as any).userRole,
})

export const userRequests = {
  async getAll() {
    const res = await api.get<UserDTO[]>('/users')
    return res.data
  },

  async getById(id: string) {
    const res = await api.get<ApiUserDTO>(`/users/${id}`)
    const role = parseRole(res.data.role) ?? 0
    return { ...res.data, role } as UserDTO
  },

  async update(id: string, dto: UpdateUserDTO) {
    const payload = mapUpdateUserDto(dto)
    const res = await api.put<UserDTO>(`/users/${id}`, payload)
    return res.data
  },

  async remove(id: string) {
    const res = await api.delete(`/users/${id}`)
    return res.data
  },

  async changeRole(id: string, dto: ChangeUserRoleDTO) {
    const payload = mapChangeRoleDto(dto)
    const res = await api.patch<UserDTO>(`/users/${id}/role`, payload)
    return res.data
  },
}