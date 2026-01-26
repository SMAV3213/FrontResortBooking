import type { ERole } from '../types/userDTOs'
import type { ERoomStatus } from '../types/roomDTOs'

export const bookingStatusRu = (status: string) => {
  const map: Record<string, string> = {
    Created: 'Создано',
    Confirmed: 'Подтверждено',
    Cancelled: 'Отменено',
    Completed: 'Завершено',
  }
  return map[status] ?? status
}

export const roomStatusRu = (status: ERoomStatus | string) => {
  const map: Record<string, string> = {
    Available: 'Доступна',
    Occupied: 'Занята',
    Maintenance: 'На обслуживании',
    '0': 'Доступна',
    '1': 'Занята',
    '2': 'На обслуживании',
  }
  return map[String(status)] ?? String(status)
}

export const roleRu = (role: ERole | string) => {
  const map: Record<string, string> = {
    Admin: 'Администратор',
    User: 'Пользователь',
    '0': 'Пользователь',
    '1': 'Администратор',
  }
  return map[String(role)] ?? String(role)
}