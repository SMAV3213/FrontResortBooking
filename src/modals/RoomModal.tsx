import React from 'react'
import clsx from 'clsx'
import { roomRequests } from '../api'
import { getApiErrorMessage } from '../api/getApiErrorMessage'
import { lockBodyScroll, unlockBodyScroll } from '../utils/bodyScrollLock'
import type { RoomDTO, CreateRoomDTO, UpdateRoomDTO, ERoomStatus } from '../types/roomDTOs'
import type { RoomTypeWithoutRoomsDTO } from '../types/roomTypeDTOs'
import s from '../pages/Admin/admin.module.scss'

type Props = {
  open: boolean
  initial: RoomDTO | null
  roomTypes: RoomTypeWithoutRoomsDTO[]
  onClose: () => void
  onSaved: () => Promise<void> | void
}

const RoomModal: React.FC<Props> = ({ open, initial, roomTypes, onClose, onSaved }) => {
  const [number, setNumber] = React.useState('')
  const [status, setStatus] = React.useState<ERoomStatus>(0 as ERoomStatus)
  const [roomTypeId, setRoomTypeId] = React.useState('')
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    lockBodyScroll()
    return () => unlockBodyScroll()
  }, [open])

  React.useEffect(() => {
    if (!open) return
    setNumber(initial?.number ?? '')
    setStatus(initial?.status ?? (0 as ERoomStatus))
    setRoomTypeId(initial?.roomType?.id ?? roomTypes[0]?.id ?? '')
  }, [open, initial, roomTypes])

  if (!open) return null

  const safeClose = () => {
    if (saving) return
    onClose()
  }

  const save = async () => {
    if (!number.trim()) return alert('Введите номер комнаты')
    if (!roomTypeId) return alert('Выберите тип комнаты')

    try {
      setSaving(true)

      if (!initial) {
        const dto: CreateRoomDTO = { number: number.trim(), roomTypeId }
        await roomRequests.create(dto)
      } else {
        const dto: UpdateRoomDTO = { number: number.trim(), status, roomTypeId }
        await roomRequests.update(initial.id, dto)
      }

      safeClose()
      await onSaved()
    } catch (e) {
      alert(getApiErrorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={s.modalOverlay} onClick={safeClose} role="presentation">
      <div className={s.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={s.modalHead}>
          <div className={s.modalTitle}>{initial ? 'Редактировать комнату' : 'Новая комната'}</div>
          <button className={clsx('btn', 'btn-ghost')} onClick={safeClose} disabled={saving}>Закрыть</button>
        </div>

        <div className={s.form}>
          <label className={s.label}>
            Номер
            <input className="input" value={number} onChange={(e) => setNumber(e.target.value)} />
          </label>

          <label className={s.label}>
            Тип комнаты
            <select className="select" value={roomTypeId} onChange={(e) => setRoomTypeId(e.target.value)}>
              {roomTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </label>

          <label className={s.label}>
            Статус
            <select className="select" value={String(status)} onChange={(e) => setStatus(Number(e.target.value) as ERoomStatus)}>
              <option value="0">Свободна</option>
              <option value="1">Занята</option>
              <option value="2">На обслуживании</option>
            </select>
          </label>

          <div className={s.modalActions}>
            <button className={clsx('btn', 'btn-primary')} onClick={save} disabled={saving}>
              {saving ? 'Сохраняем…' : 'Сохранить'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomModal