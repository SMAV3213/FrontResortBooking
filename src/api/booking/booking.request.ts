import { api } from '../api'
import { toApiDateTime } from '../utils'
import type { BookingDTO, CreateBookingDTO, UpdateBookingDTO } from '../../types/bookingDTOs'

export const bookingRequests = {
  async getAll() {
    const res = await api.get<BookingDTO[]>('/bookings')
    return res.data
  },

  async getMy() {
    const res = await api.get<BookingDTO[]>('/bookings/my')
    return res.data
  },

  async getById(id: string) {
    const res = await api.get<BookingDTO>(`/bookings/${id}`)
    return res.data
  },

  async create(dto: CreateBookingDTO) {
    const payload = {
      ...dto,
      checkIn: toApiDateTime(dto.checkIn),
      checkOut: toApiDateTime(dto.checkOut),
    }

    const res = await api.post<BookingDTO>('/bookings', payload)
    return res.data
  },

  async update(id: string, dto: UpdateBookingDTO) {
    const payload = {
      ...dto,
      checkIn: toApiDateTime(dto.checkIn),
      checkOut: toApiDateTime(dto.checkOut),
    }

    const res = await api.put<BookingDTO>(`/bookings/${id}`, payload)
    return res.data
  },

  async cancel(id: string) {
    const res = await api.delete(`/bookings/${id}`)
    return res.data
  },
}