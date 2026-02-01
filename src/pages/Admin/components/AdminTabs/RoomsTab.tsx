import React from 'react'
import clsx from 'clsx'

import AdminSection from '../AdminSection'
import RoomTypeModal from '../../../../modals/RoomTypeModal'
import Pagination from '../../../../components/Pagination/Pagination'
import AdminListToolbar from '../AdminToolBar'
import ConfirmModal from '../../../../modals/ConfirmModal/ConfirmModal'

import { roomTypesRequests } from '../../../../api'
import { getApiErrorMessage } from '../../../../api/getApiErrorMessage'
import type { RoomTypeWithoutRoomsDTO } from '../../../../types/roomTypeDTOs'

import s from '../../admin.module.scss'

const RoomTypesTab: React.FC = () => {
  const [items, setItems] = React.useState<RoomTypeWithoutRoomsDTO[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [page, setPage] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const pageSize = 12
  const [search, setSearch] = React.useState('')

  const [modalOpen, setModalOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<RoomTypeWithoutRoomsDTO | null>(null)

  // confirm delete
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const [typeToDelete, setTypeToDelete] = React.useState<RoomTypeWithoutRoomsDTO | null>(null)

  const load = React.useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await roomTypesRequests.getAll({
        page,
        pageSize,
        search: search.trim() || undefined,
        sortBy: 'name',
        sortDir: 'asc',
      })
      setItems(res.items)
      setTotal(res.total)
    } catch (e) {
      setItems([])
      setTotal(0)
      setError(getApiErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, search])

  React.useEffect(() => {
    const t = setTimeout(() => load(), 300)
    return () => clearTimeout(t)
  }, [load])

  const openDelete = (x: RoomTypeWithoutRoomsDTO) => {
    setTypeToDelete(x)
    setConfirmOpen(true)
  }

  const doDelete = async () => {
    if (!typeToDelete) return
    try {
      setConfirmLoading(true)
      await roomTypesRequests.remove(typeToDelete.id)
      setConfirmOpen(false)
      setTypeToDelete(null)
      await load()
    } catch (e) {
      alert(getApiErrorMessage(e))
    } finally {
      setConfirmLoading(false)
    }
  }

  const confirmText = typeToDelete
    ? `${typeToDelete.name}\nВместимость: до ${typeToDelete.capacity}\nЦена: ${typeToDelete.pricePerNight} ₽/ночь\nФото: ${typeToDelete.imageUrls?.length ?? 0}`
    : ''

  return (
    <>
      <AdminSection
        title="Типы номеров"
        actions={
          <AdminListToolbar
            search={
              <input
                className={clsx('input', s.w240)}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Поиск…"
              />
            }
            actions={
              <>
                <button className={clsx('btn', 'btn-ghost')} onClick={load} disabled={loading}>Обновить</button>

                <button className={clsx('btn', 'btn-ghost')} type="button" onClick={() => { setSearch(''); setPage(1) }}>
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
        {error && <div className={s.error}>{error}</div>}

        {loading ? (
          <div className={s.muted}>Загрузка…</div>
        ) : (
          <>
            <div className={s.list}>
              {items.map((x) => (
                <div key={x.id} className={s.rowCard}>
                  <div className={s.rowMain}>
                    <div className={s.rowTitle}>{x.name}</div>
                    <div className={s.rowSub}>
                      до {x.capacity} • {x.pricePerNight} ₽/ночь • фото: {x.imageUrls?.length ?? 0}
                    </div>
                  </div>

                  <div className={s.rowActions}>
                    <button className={clsx('btn', 'btn-ghost')} onClick={() => { setEditing(x); setModalOpen(true) }}>
                      Редактировать
                    </button>
                    <button className={clsx('btn')} onClick={() => openDelete(x)}>
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
        title="Удалить тип номера?"
        text={confirmText}
        confirmText="Удалить"
        cancelText="Отмена"
        loading={confirmLoading}
        onClose={() => {
          if (confirmLoading) return
          setConfirmOpen(false)
          setTypeToDelete(null)
        }}
        onConfirm={doDelete}
      />

      <RoomTypeModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSaved={load}
      />
    </>
  )
}

export default RoomTypesTab