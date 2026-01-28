import { ERole } from '../types/userDTOs'

export const parseRole = (v: unknown): ERole | null => {
  if (v === null || v === undefined) return null
  if (typeof v === 'number') return v as ERole

  const s = String(v).toLowerCase()
  if (s === 'admin') return ERole.Admin
  if (s === 'user') return ERole.User

  const n = Number(s)
  if (Number.isFinite(n)) return n as ERole

  return null
}