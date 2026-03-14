export const queryKeys = {
  roomTypes: {
    all: ['room-types'] as const,
    list: (params?: Record<string, unknown>) => ['room-types', 'list', params] as const,
    available: (params: { guests: number; checkIn: string; checkOut: string }) =>
      ['room-types', 'available', params] as const,
    detail: (id: string) => ['room-types', id] as const,
  },
  rooms: {
    all: ['rooms'] as const,
    list: (params?: Record<string, unknown>) => ['rooms', 'list', params] as const,
    detail: (id: string) => ['rooms', id] as const,
  },
  users: {
    all: ['users'] as const,
    list: (params?: Record<string, unknown>) => ['users', 'list', params] as const,
    detail: (id: string) => ['users', id] as const,
  },
  bookings: {
    all: ['bookings'] as const,
    list: (params?: Record<string, unknown>) => ['bookings', 'list', params] as const,
    my: (params?: Record<string, unknown>) => ['bookings', 'my', params] as const,
    today: (kind: 'checkIn' | 'checkOut') => ['bookings', 'today', kind] as const,
    detail: (id: string) => ['bookings', id] as const,
  },
}
