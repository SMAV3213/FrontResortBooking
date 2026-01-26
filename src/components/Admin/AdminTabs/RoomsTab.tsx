import React from 'react'
import clsx from 'clsx'

import AdminSection from '../AdminSection'
import RoomModal from '../../../modals/RoomModal'

import { roomRequests, roomTypesRequests } from '../../../api'
import { getApiErrorMessage } from '../../../api/getApiErrorMessage'
import type { RoomDTO } from '../../../types/roomDTOs'
import type { RoomTypeWithoutRoomsDTO } from '../../../types/roomTypeDTOs'
import { roomStatusRu } from '../../../shared/labels'
import s from "../../../pages/Admin/admin.module.scss"


const RoomsTab: React.FC = () => {
  const [rooms, setRooms] = React.useState<RoomDTO[]>([])
  const [types, setTypes] = React.useState<RoomTypeWithoutRoomsDTO[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [modalOpen, setModalOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<RoomDTO | null>(null)

  const load = React.useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const [roomsData, typesData] = await Promise.all([
        roomRequests.getAll(),
        roomTypesRequests.getAll(),
      ])
      setRooms(roomsData)
      setTypes(typesData)
    } catch (e) {
      setRooms([])
      setTypes([])
      setError(getApiErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => { load() }, [load])

  const onDelete = async (id: string) => {
    if (!window.confirm('Удалить комнату?')) return
    try {
      await roomRequests.remove(id)
      await load()
    } catch (e) {
      alert(getApiErrorMessage(e))
    }
  }

  return (
    <>
      <AdminSection
        title="Комнаты"
        actions={
          <>
            <button className={clsx('btn', 'btn-ghost')} onClick={load} disabled={loading}>Обновить</button>
            <button
              className={clsx('btn', 'btn-primary')}
              onClick={() => { setEditing(null); setModalOpen(true) }}
            >
              Добавить
            </button>
          </>
        }
      >
        {error && <div className={s.error}>{error}</div>}
        {loading ? (
          <div className={s.muted}>Загрузка…</div>
        ) : (
          <div className={s.list}>
            {rooms.map((r) => (
              <div key={r.id} className={s.rowCard}>
                <div className={s.rowMain}>
                  <div className={s.rowTitle}>Комната {r.number}</div>
                  <div className={s.rowSub}>
                    {r.roomType?.name ?? '—'} • статус: {roomStatusRu(String(r.status))}
                  </div>
                </div>

                <div className={s.rowActions}>
                  <button className={clsx('btn', 'btn-ghost')} onClick={() => { setEditing(r); setModalOpen(true) }}>
                    Редактировать
                  </button>
                  <button className={clsx('btn')} onClick={() => onDelete(r.id)}>Удалить</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminSection>

      <RoomModal
        open={modalOpen}
        initial={editing}
        roomTypes={types}
        onClose={() => setModalOpen(false)}
        onSaved={load}
      />
    </>
  )
}

export default RoomsTab