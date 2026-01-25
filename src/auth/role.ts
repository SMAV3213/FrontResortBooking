import { ERole } from '../types/userDTOs'

export const parseRole = (value: unknown): ERole | null => {
  if (value === null || value === undefined) return null

  if (typeof value === 'number') return value as ERole

  const s = String(value).toLowerCase()
  if (s === 'admin') return ERole.Admin
  if (s === 'user') return ERole.User

  // если строкой "0"/"1"
  const n = Number(s)
  if (Number.isFinite(n)) return n as ERole

  return null
}