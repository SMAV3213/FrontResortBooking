export type BookingStatus = 'Created' | 'Confirmed' | 'Cancelled' | 'Completed'

export const BOOKING_STATUS_RU: Record<BookingStatus, string> = {
  Created: 'Создано',
  Confirmed: 'Подтверждено',
  Cancelled: 'Отменено',
  Completed: 'Завершено',
}

export const bookingStatusLabel = (status: string) => {
  return BOOKING_STATUS_RU[status as BookingStatus] ?? status
}