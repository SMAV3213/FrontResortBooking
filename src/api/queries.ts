import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { roomTypesRequests } from './roomTypes/roomTypes.request'
import { roomRequests } from './room/room.request'
import { userRequests } from './user/user.request'
import { bookingRequests } from './booking/booking.request'
import type { RoomTypesQuery } from './roomTypes/roomTypes.request'
import type { RoomsQuery } from './room/room.request'
import type { UsersQuery } from './user/user.request'
import type { BookingsQuery } from './booking/booking.request'

// ——— Room types ———
export function useRoomTypesList(params: RoomTypesQuery & { page: number; pageSize: number }) {
  return useQuery({
    queryKey: queryKeys.roomTypes.list(params),
    queryFn: () => roomTypesRequests.getAll(params),
    placeholderData: keepPreviousData,
  })
}

export function useRoomTypesAvailable(params: { guests: number; checkIn: string; checkOut: string } | null) {
  return useQuery({
    queryKey: queryKeys.roomTypes.available(params!),
    queryFn: () =>
      roomTypesRequests.getAvailable({
        guests: params!.guests,
        checkIn: `${params!.checkIn}T00:00:00Z`,
        checkOut: `${params!.checkOut}T00:00:00Z`,
      }),
    enabled: !!params,
    placeholderData: keepPreviousData,
  })
}

/** Список типов комнат для селектов/модалок (кэш, тихая подгрузка) */
export function useRoomTypesForSelect(params?: { page?: number; pageSize?: number; search?: string }) {
  const p = { page: 1, pageSize: 100, sortBy: 'name' as const, sortDir: 'asc' as const, ...params }
  return useQuery({
    queryKey: queryKeys.roomTypes.list(p),
    queryFn: () => roomTypesRequests.getAll(p),
    placeholderData: keepPreviousData,
  })
}

// ——— Rooms ———
export function useRoomsList(params: RoomsQuery) {
  return useQuery({
    queryKey: queryKeys.rooms.list(params),
    queryFn: () => roomRequests.getAll(params),
    placeholderData: keepPreviousData,
  })
}

/** Комнаты + типы для вкладки Комнаты (одним запросом через два useQuery) */
export function useRoomsTabData(params: RoomsQuery) {
  const roomsQuery = useRoomsList(params)
  const typesQuery = useRoomTypesForSelect({ page: 1, pageSize: 100 })
  return {
    rooms: roomsQuery.data?.items ?? [],
    total: roomsQuery.data?.total ?? 0,
    types: typesQuery.data?.items ?? [],
    loading: roomsQuery.isLoading || typesQuery.isLoading,
    isFetching: roomsQuery.isFetching || typesQuery.isFetching,
    error: roomsQuery.error ?? typesQuery.error,
    refetch: async () => {
      await Promise.all([roomsQuery.refetch(), typesQuery.refetch()])
    },
  }
}

// ——— Users ———
export function useUsersList(params: UsersQuery) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => userRequests.getAll(params),
    placeholderData: keepPreviousData,
  })
}

// ——— Bookings ———
export function useBookingsList(params: BookingsQuery) {
  return useQuery({
    queryKey: queryKeys.bookings.list(params),
    queryFn: () => bookingRequests.getAll(params),
    placeholderData: keepPreviousData,
  })
}

export function useMyBookings(params: BookingsQuery) {
  return useQuery({
    queryKey: queryKeys.bookings.my(params),
    queryFn: () => bookingRequests.getMy(params),
    placeholderData: keepPreviousData,
  })
}

const toDateTimeParam = (d: string) => (d ? `${d}T00:00:00` : undefined)

export function useBookingsToday() {
  const todayRange = () => {
    const t = new Date()
    const pad2 = (n: number) => String(n).padStart(2, '0')
    const start = `${t.getFullYear()}-${pad2(t.getMonth() + 1)}-${pad2(t.getDate())}`
    const t2 = new Date(t)
    t2.setDate(t2.getDate() + 1)
    const end = `${t2.getFullYear()}-${pad2(t2.getMonth() + 1)}-${pad2(t2.getDate())}`
    return { start, end }
  }

  const { start, end } = todayRange()

  const checkInQuery = useQuery({
    queryKey: queryKeys.bookings.today('checkIn'),
    queryFn: () =>
      bookingRequests.getAll({
        page: 1,
        pageSize: 5,
        checkInFrom: toDateTimeParam(start),
        checkInTo: toDateTimeParam(end),
        sortBy: 'checkIn',
        sortDir: 'asc',
      }),
    placeholderData: keepPreviousData,
  })

  const checkOutQuery = useQuery({
    queryKey: queryKeys.bookings.today('checkOut'),
    queryFn: () =>
      bookingRequests.getAll({
        page: 1,
        pageSize: 5,
        checkOutFrom: toDateTimeParam(start),
        checkOutTo: toDateTimeParam(end),
        sortBy: 'checkIn',
        sortDir: 'asc',
      }),
    placeholderData: keepPreviousData,
  })

  return {
    todayIn: checkInQuery.data?.items ?? [],
    todayOut: checkOutQuery.data?.items ?? [],
    todayLoading: checkInQuery.isLoading || checkOutQuery.isLoading,
    todayFetching: checkInQuery.isFetching || checkOutQuery.isFetching,
    todayError: checkInQuery.error ?? checkOutQuery.error,
    refetchToday: () => Promise.all([checkInQuery.refetch(), checkOutQuery.refetch()]),
  }
}

// ——— Invalidation helpers ———
export function useInvalidateRoomTypes() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: queryKeys.roomTypes.all })
}

export function useInvalidateRooms() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: queryKeys.rooms.all })
}

export function useInvalidateUsers() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: queryKeys.users.all })
}

export function useInvalidateBookings() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: queryKeys.bookings.all })
}
