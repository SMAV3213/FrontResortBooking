import { api } from '../api'
import type { RoomDTO, ERoomStatus } from '../../types/roomDTOs'
import type { PagedResult } from '../paged'

export type RoomsQuery = {
  page?: number
  pageSize?: number
  search?: string
  roomTypeId?: string
  status?: 'Available' | 'Occupied' | 'Maintenance'
  sortBy?: 'number' | 'status' | 'createdAt'
  sortDir?: 'asc' | 'desc'
}

export const roomRequests = {
  async getAll(params?: RoomsQuery) {
    const res = await api.get<PagedResult<RoomDTO>>('/rooms', { params })
    return res.data
  },

  async getById(id: string) {
    const res = await api.get<RoomDTO>(`/rooms/${id}`)
    return res.data
  },

  async create(dto: { number: string; roomTypeId: string }) {
    const res = await api.post('/rooms', dto)
    return res.data
  },

  async update(id: string, dto: { number: string; status: ERoomStatus | string; roomTypeId: string }) {
    const res = await api.put(`/rooms/${id}`, dto)
    return res.data
  },

  async remove(id: string) {
    const res = await api.delete(`/rooms/${id}`)
    return res.data
  },
}