import { api } from '../api'
import { toApiDateTime } from '../utils'
import type { RoomTypeWithoutRoomsDTO, CreateRoomTypeDTO, UpdateRoomTypeDTO } from '../../types/roomTypeDTOs'

const buildCreateForm = (dto: CreateRoomTypeDTO, images?: File[]) => {
  const fd = new FormData()
  fd.append('Name', dto.name)
  fd.append('Description', dto.description)
  fd.append('Capacity', String(dto.capacity))
  fd.append('PricePerNight', String(dto.pricePerNight))
  ;(images ?? []).forEach((img) => fd.append('images', img))
  return fd
}

const buildUpdateForm = (id: string, dto: UpdateRoomTypeDTO, images?: File[]) => {
  const fd = new FormData()
  fd.append('Id', id)
  fd.append('Name', dto.name)
  fd.append('Description', dto.description)
  fd.append('Capacity', String(dto.capacity))
  fd.append('PricePerNight', String(dto.pricePerNight))
  ;(images ?? []).forEach((img) => fd.append('images', img))
  return fd
}

export const roomTypesRequests = {
  async getAll() {
    const res = await api.get<RoomTypeWithoutRoomsDTO[]>('/room-types')
    return res.data
  },

  async getById(id: string) {
    const res = await api.get<RoomTypeWithoutRoomsDTO>(`/room-types/${id}`)
    return res.data
  },

  async getAvailable(params: { guests?: number; checkIn?: Date | string; checkOut?: Date | string }) {
    const res = await api.get<RoomTypeWithoutRoomsDTO[]>('/room-types/available', {
      params: {
        guests: params.guests,
        checkIn: params.checkIn ? toApiDateTime(params.checkIn) : undefined,
        checkOut: params.checkOut ? toApiDateTime(params.checkOut) : undefined,
      },
    })
    return res.data
  },

  async create(dto: CreateRoomTypeDTO, images?: File[]) {
    const fd = buildCreateForm(dto, images)
    const res = await api.post<RoomTypeWithoutRoomsDTO>('/room-types', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  async update(id: string, dto: UpdateRoomTypeDTO, images?: File[]) {
    const fd = buildUpdateForm(id, dto, images)
    const res = await api.put<RoomTypeWithoutRoomsDTO>(`/room-types/${id}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  async remove(id: string) {
    const res = await api.delete(`/room-types/${id}`)
    return res.data
  },
}