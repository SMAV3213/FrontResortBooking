import React from 'react'
import clsx from 'clsx'
import { lockBodyScroll, unlockBodyScroll } from '../utils/bodyScrollLock'
import type { BookingDTO } from '../types/bookingDTOs'
import s from '../pages/Admin/admin.module.scss'

type Props = {
  open: boolean
  booking: BookingDTO | null
  onClose: () => void
  onSave: (payload: { checkIn: string; checkOut: string; guestsCount: number }) => Promise<void>
}

const pad2 = (n: number) => String(n).padStart(2, '0')
const toDateInput = (v: any) => {
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

const GUESTS = Array.from({ length: 10 }, (_, i) => i + 1)

const BookingEditModal: React.FC<Props> = ({ open, booking, onClose, onSave }) => {
  const [checkIn, setCheckIn] = React.useState('')
  const [checkOut, setCheckOut] = React.useState('')
  const [guestsCount, setGuestsCount] = React.useState(1)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) return
    lockBodyScroll()
    return () => unlockBodyScroll()
  }, [open])

  React.useEffect(() => {
    if (!open || !booking) return
    setError(null)
    setCheckIn(toDateInput(booking.checkIn))
    setCheckOut(toDateInput(booking.checkOut))
    setGuestsCount(Number(booking.guestsCount ?? 1))
  }, [open, booking])

  if (!open || !booking) return null

  const safeClose = () => {
    if (saving) return
    onClose()
  }

  const submit = async () => {
    setError(null)
    if (!checkIn || !checkOut) return setError('Выберите даты')
    if (checkOut <= checkIn) return setError('Дата выезда должна быть позже даты заезда')

    try {
      setSaving(true)
      await onSave({ checkIn, checkOut, guestsCount })
      safeClose()
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={s.modalOverlay} onClick={safeClose} role="presentation">
      <div className={s.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={s.modalHead}>
          <div className={s.modalTitle}>Редактировать бронь</div>
          <button className={clsx('btn', 'btn-ghost')} onClick={safeClose} disabled={saving}>Закрыть</button>
        </div>

        <div className={s.form}>
          <label className={s.label}>
            Заезд
            <input className="input" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          </label>

          <label className={s.label}>
            Выезд
            <input className="input" type="date" value={checkOut} min={checkIn || undefined} onChange={(e) => setCheckOut(e.target.value)} />
          </label>

          <label className={s.label}>
            Гостей
            <select className="select" value={String(guestsCount)} onChange={(e) => setGuestsCount(Number(e.target.value))}>
              {GUESTS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>

          {error && <div className={s.error}>{error}</div>}

          <div className={s.modalActions}>
            <button className={clsx('btn', 'btn-primary')} onClick={submit} disabled={saving}>
              {saving ? 'Сохраняем…' : 'Сохранить'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingEditModal