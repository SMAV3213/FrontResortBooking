import React from 'react'
import clsx from 'clsx'

import AdminSection from '../AdminSection'
import RoomTypeModal from '../../../../modals/RoomTypeModal'
import Pagination from '../../../../components/Pagination/Pagination'
import AdminListToolbar from '../AdminToolBar'
import ConfirmModal from '../../../../modals/ConfirmModal/ConfirmModal'

import { useRoomTypesList, useInvalidateRoomTypes } from '../../../../api/queries'
import { roomTypesRequests } from '../../../../api'
import { getApiErrorMessage } from '../../../../api/getApiErrorMessage'
import type { RoomTypeWithoutRoomsDTO } from '../../../../types/roomTypeDTOs'

import s from '../../admin.module.scss'

const pageSize = 12

const RoomTypesTab: React.FC = () => {
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState('')

  const { data, isLoading, isFetching, isPlaceholderData, error, refetch } = useRoomTypesList({
    page,
    pageSize,
    search: search.trim() || undefined,
    sortBy: 'name',
    sortDir: 'asc',
  })

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const invalidate = useInvalidateRoomTypes()

  const [modalOpen, setModalOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<RoomTypeWithoutRoomsDTO | null>(null)

  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const [typeToDelete, setTypeToDelete] = React.useState<RoomTypeWithoutRoomsDTO | null>(null)

  const load = React.useCallback(async () => {
    invalidate()
    await refetch()
  }, [invalidate, refetch])

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
      invalidate()
      await refetch()
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
                <button className={clsx('btn', 'btn-ghost')} onClick={load} disabled={isLoading}>Обновить</button>

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
        {error && <div className={s.error}>{getApiErrorMessage(error)}</div>}
        {(isFetching && isPlaceholderData) && <div className={s.muted} style={{ fontSize: 12 }}>Обновление…</div>}

        {isLoading && !data ? (
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
        onSaved={() => { invalidate(); refetch() }}
      />
    </>
  )
}

export default RoomTypesTab