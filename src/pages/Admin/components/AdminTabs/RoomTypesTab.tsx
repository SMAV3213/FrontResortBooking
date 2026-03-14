import React from 'react'
import clsx from 'clsx'

import AdminSection from '../AdminSection'
import RoomModal from '../../../../modals/RoomModal'
import Pagination from '../../../../components/Pagination/Pagination'
import AdminListToolbar from '../AdminToolBar'
import ConfirmModal from '../../../../modals/ConfirmModal/ConfirmModal'

import { useRoomsTabData, useInvalidateRooms, useInvalidateRoomTypes } from '../../../../api/queries'
import { roomRequests } from '../../../../api'
import { getApiErrorMessage } from '../../../../api/getApiErrorMessage'
import type { RoomDTO } from '../../../../types/roomDTOs'
import type { RoomTypeWithoutRoomsDTO } from '../../../../types/roomTypeDTOs'
import { roomStatusRu } from '../../../../shared/labels'

import s from '../../admin.module.scss'

const pageSize = 20

const RoomsTab: React.FC = () => {
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState('')
  const [status, setStatus] = React.useState<'Available' | 'Occupied' | 'Maintenance' | ''>('')
  const [roomTypeId, setRoomTypeId] = React.useState<string>('')
  const [sortBy, setSortBy] = React.useState<'number' | 'status' | 'createdAt'>('number')
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc')

  const { rooms, total, types, loading, isFetching, error, refetch } = useRoomsTabData({
    page,
    pageSize,
    search: search.trim() || undefined,
    status: status || undefined,
    roomTypeId: roomTypeId || undefined,
    sortBy,
    sortDir,
  })

  const invalidateRooms = useInvalidateRooms()
  const invalidateRoomTypes = useInvalidateRoomTypes()

  const load = React.useCallback(async () => {
    invalidateRooms()
    invalidateRoomTypes()
    await refetch()
  }, [invalidateRooms, invalidateRoomTypes, refetch])

  const [modalOpen, setModalOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<RoomDTO | null>(null)

  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const [roomToDelete, setRoomToDelete] = React.useState<RoomDTO | null>(null)

  const openDelete = (r: RoomDTO) => {
    setRoomToDelete(r)
    setConfirmOpen(true)
  }

  const doDelete = async () => {
    if (!roomToDelete) return
    try {
      setConfirmLoading(true)
      await roomRequests.remove(roomToDelete.id)
      setConfirmOpen(false)
      setRoomToDelete(null)
      invalidateRooms()
      await refetch()
    } catch (e) {
      alert(getApiErrorMessage(e))
    } finally {
      setConfirmLoading(false)
    }
  }

  const confirmText = roomToDelete
    ? `Комната: ${roomToDelete.number}\nТип: ${roomToDelete.roomType?.name ?? '—'}\nСтатус: ${roomStatusRu(String(roomToDelete.status))}`
    : ''

  return (
    <>
      <AdminSection
        title="Комнаты"
        actions={
          <AdminListToolbar
            filters={
              <>
                <select className={clsx('select', s.w240)} value={roomTypeId} onChange={(e) => { setRoomTypeId(e.target.value); setPage(1) }}>
                  <option value="">Все типы</option>
                  {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>

                <select className={clsx('select', s.w200)} value={status} onChange={(e) => { setStatus(e.target.value as any); setPage(1) }}>
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
              <input className={clsx('input', s.w140)} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Номер…" />
            }
            actions={
              <>
                <button className={clsx('btn', 'btn-ghost')} onClick={load} disabled={loading}>Обновить</button>

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

                <button className={clsx('btn', 'btn-primary')} onClick={() => { setEditing(null); setModalOpen(true) }}>
                  Добавить
                </button>
              </>
            }
          />
        }
      >
        {error && <div className={s.error}>{getApiErrorMessage(error)}</div>}
        {isFetching && <div className={s.muted} style={{ fontSize: 12 }}>Обновление…</div>}

        {loading && rooms.length === 0 ? (
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
                    <button className={clsx('btn')} onClick={() => openDelete(r)}>
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
          </>
        )}
      </AdminSection>

      <ConfirmModal
        open={confirmOpen}
        variant="danger"
        title="Удалить комнату?"
        text={confirmText}
        confirmText="Удалить"
        cancelText="Отмена"
        loading={confirmLoading}
        onClose={() => {
          if (confirmLoading) return
          setConfirmOpen(false)
          setRoomToDelete(null)
        }}
        onConfirm={doDelete}
      />

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