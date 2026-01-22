import { api } from '../api'
import { type RoomDTO, type CreateRoomDTO, type UpdateRoomDTO, ERoomStatus } from '../../types/roomDTOs'

const roomStatusToApi = (s: ERoomStatus | string) => (typeof s === 'string' ? s : ERoomStatus[s])

export const roomRequests = {
  // GET /api/rooms (admin)
  async getAll() {
    const res = await api.get<RoomDTO[]>('/rooms')
    return res.data
  },

  // GET /api/rooms/{id} (admin)
  async getById(id: string) {
    const res = await api.get<RoomDTO>(`/rooms/${id}`)
    return res.data
  },

  // POST /api/rooms (admin)
  async create(dto: CreateRoomDTO) {
    const res = await api.post<RoomDTO>('/rooms', dto)
    return res.data
  },

  // PUT /api/rooms/{id} (admin)
  async update(id: string, dto: UpdateRoomDTO) {
    const payload = {
      ...dto,
      status: roomStatusToApi(dto.status as any),
    }
    const res = await api.put<RoomDTO>(`/rooms/${id}`, payload)
    return res.data
  },

  // DELETE /api/rooms/{id} (admin)
  async remove(id: string) {
    const res = await api.delete(`/rooms/${id}`)
    return res.data
  },
}