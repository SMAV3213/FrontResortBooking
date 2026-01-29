import { api } from '../api'
import type { PagedResult } from '../paged'
import type { BookingDTO, CreateBookingDTO, UpdateBookingDTO } from '../../types/bookingDTOs'

export type BookingStatus = 'Created' | 'Confirmed' | 'Cancelled' | 'Completed'

export type BookingsQuery = {
  page?: number
  pageSize?: number
  status?: BookingStatus
  userId?: string
  roomId?: string
  roomTypeId?: string
  
  from?: string
  to?: string

  checkInFrom?: string
  checkInTo?: string
  checkOutFrom?: string
  checkOutTo?: string

  sortBy?: 'createdAt' | 'totalPrice' | 'checkIn'
  sortDir?: 'asc' | 'desc'
}

export const bookingRequests = {
  async getAll(params?: BookingsQuery) {
    const res = await api.get<PagedResult<BookingDTO>>('/bookings', { params })
    return res.data
  },

  async getMy(params?: BookingsQuery) {
    const res = await api.get<PagedResult<BookingDTO>>('/bookings/my', { params })
    return res.data
  },

  async getById(id: string) {
    const res = await api.get<BookingDTO>(`/bookings/${id}`)
    return res.data
  },

  async create(dto: CreateBookingDTO) {
    const payload = {
      ...dto,
      checkIn: dto.checkIn instanceof Date ? dto.checkIn.toISOString() : dto.checkIn,
      checkOut: dto.checkOut instanceof Date ? dto.checkOut.toISOString() : dto.checkOut,
    }
    const res = await api.post<BookingDTO>('/bookings', payload)
    return res.data
  },

  async update(id: string, dto: UpdateBookingDTO) {
    const payload = {
      ...dto,
      checkIn: dto.checkIn instanceof Date ? dto.checkIn.toISOString() : dto.checkIn,
      checkOut: dto.checkOut instanceof Date ? dto.checkOut.toISOString() : dto.checkOut,
    }
    const res = await api.put<BookingDTO>(`/bookings/${id}`, payload)
    return res.data
  },

  async cancel(id: string) {
    const res = await api.delete(`/bookings/${id}`)
    return res.data
  },
}