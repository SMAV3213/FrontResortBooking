import React from 'react'
import clsx from 'clsx'

import AdminSection from '../AdminSection'
import RoomModal from '../../../../modals/RoomModal'
import Pagination from '../../../../components/Pagination/Pagination'

import { roomRequests, roomTypesRequests } from '../../../../api'
import { getApiErrorMessage } from '../../../../api/getApiErrorMessage'
import type { RoomDTO } from '../../../../types/roomDTOs'
import type { RoomTypeWithoutRoomsDTO } from '../../../../types/roomTypeDTOs'
import { roomStatusRu } from '../../../../shared/labels'
import AdminListToolbar from '../AdminToolBar'

import s from '../../admin.module.scss'

const RoomsTab: React.FC = () => {
  const [rooms, setRooms] = React.useState<RoomDTO[]>([])
  const [total, setTotal] = React.useState(0)

  const [types, setTypes] = React.useState<RoomTypeWithoutRoomsDTO[]>([])

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [page, setPage] = React.useState(1)
  const pageSize = 20

  const [search, setSearch] = React.useState('')
  const [status, setStatus] = React.useState<'Available' | 'Occupied' | 'Maintenance' | ''>('')
  const [roomTypeId, setRoomTypeId] = React.useState<string>('')
  const [sortBy, setSortBy] = React.useState<'number' | 'status' | 'createdAt'>('number')
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc')

  const [modalOpen, setModalOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<RoomDTO | null>(null)

  const load = React.useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const [roomsRes, typesRes] = await Promise.all([
        roomRequests.getAll({
          page,
          pageSize,
          search: search.trim() || undefined,
          status: status || undefined,
          roomTypeId: roomTypeId || undefined,
          sortBy,
          sortDir,
        }),
        roomTypesRequests.getAll({ page: 1, pageSize: 100, sortBy: 'name', sortDir: 'asc' }),
      ])

      setRooms(roomsRes.items)
      setTotal(roomsRes.total)

      setTypes(typesRes.items)
    } catch (e) {
      setRooms([])
      setTotal(0)
      setTypes([])
      setError(getApiErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, search, status, roomTypeId, sortBy, sortDir])

  React.useEffect(() => {
    const t = setTimeout(() => load(), 200)
    return () => clearTimeout(t)
  }, [load])

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
          <AdminListToolbar
            filters={
              <>
                <select
                  className={clsx('select', s.w240)}
                  value={roomTypeId}
                  onChange={(e) => { setRoomTypeId(e.target.value); setPage(1) }}
                >
                  <option value="">Все типы</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>

                <select
                  className={clsx('select', s.w200)}
                  value={status}
                  onChange={(e) => { setStatus(e.target.value as any); setPage(1) }}
                >
                  <option value="">Все статусы</option>
                  <option value="Available">Доступна</option>
                  <option value="Occupied">Занята</option>
                  <option value="Maintenance">На обслуживании</option>
                </select>
              </>
            }
            sort={
              <>
                <select className={clsx('select', s.w200)} value={sortBy} onChange={(e) => { setSortBy(e.target.value as any); setPage(1) }}>
                  <option value="number">По номеру</option>
                  <option value="status">По статусу</option>
                  <option value="createdAt">По дате создания</option>
                </select>

                <select className={clsx('select', s.w160)} value={sortDir} onChange={(e) => { setSortDir(e.target.value as any); setPage(1) }}>
                  <option value="asc">Возрастание</option>
                  <option value="desc">Убывание</option>
                </select>
              </>
            }
            search={
              <>
                <input
                  className={clsx('input', s.w140)}
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Номер…"
                />
              </>
            }
            actions={
              <>
                <button className={clsx('btn', 'btn-ghost')} onClick={load} disabled={loading}>
                  Обновить
                </button>

                <button
                  className={clsx('btn', 'btn-ghost')}
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setRoomTypeId('')
                    setStatus('')
                    setSortBy('number')
                    setSortDir('asc')
                    setPage(1)
                  }}
                >
                  Сбросить
                </button>

                <button
                  className={clsx('btn', 'btn-primary')}
                  onClick={() => { setEditing(null); setModalOpen(true) }}
                >
                  Добавить
                </button>
              </>
            }
          />
        }
      >
        {error && <div className={s.error}>{error}</div>}

        {
          loading ? (
            <div className={s.muted}>Загрузка…</div>
          ) : (
            <>
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
                      <button className={clsx('btn')} onClick={() => onDelete(r.id)}>
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
            </>
          )
        }
      </AdminSection >

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