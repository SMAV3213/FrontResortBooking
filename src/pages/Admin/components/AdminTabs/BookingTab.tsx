import React from 'react'
import clsx from 'clsx'

import AdminSection from '../AdminSection'
import Pagination from '../../../../components/Pagination/Pagination'
import AdminListToolbar from '../AdminToolBar'
import ConfirmModal from '../../../../modals/ConfirmModal/ConfirmModal'

import { useBookingsList, useBookingsToday, useInvalidateBookings } from '../../../../api/queries'
import { bookingRequests, userRequests, roomRequests, roomTypesRequests } from '../../../../api'
import { getApiErrorMessage } from '../../../../api/getApiErrorMessage'
import type { BookingDTO, BookingStatus } from '../../../../types/bookingDTOs'
import { bookingStatusRu } from '../../../../shared/labels'
import BookingEditModal from '../../../../modals/BookingEditModal'

import EntitySearchSelect, { type SearchOption } from '../../../../components/EntitySearchSelect/EntitySearchSelect'
import type { UserDTO } from '../../../../types/userDTOs'
import type { RoomDTO } from '../../../../types/roomDTOs'
import type { RoomTypeWithoutRoomsDTO } from '../../../../types/roomTypeDTOs'

import s from '../../admin.module.scss'

const dateFmt = new Intl.DateTimeFormat('ru-RU', { year: 'numeric', month: '2-digit', day: '2-digit' })

const pad2 = (n: number) => String(n).padStart(2, '0')
const dateOnly = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
const toDateTimeParam = (d: string) => (d ? `${d}T00:00:00` : undefined)

const toDate = (v: any) => {
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? null : d
}

const todayRangeDateOnly = () => {
  const t = new Date()
  const start = dateOnly(t)
  const t2 = new Date(t)
  t2.setDate(t2.getDate() + 1)
  const end = dateOnly(t2)
  return { start, end }
}

const STATUS_OPTIONS: { value: '' | BookingStatus; label: string }[] = [
  { value: '', label: 'Все статусы' },
  { value: 'Created', label: bookingStatusRu('Created') },
  { value: 'Confirmed', label: bookingStatusRu('Confirmed') },
  { value: 'Cancelled', label: bookingStatusRu('Cancelled') },
  { value: 'Completed', label: bookingStatusRu('Completed') },
]

const SORT_OPTIONS: { value: 'checkIn' | 'createdAt' | 'totalPrice'; label: string }[] = [
  { value: 'checkIn', label: 'По дате заезда' },
  { value: 'createdAt', label: 'По дате создания' },
  { value: 'totalPrice', label: 'По цене' },
]

const BookingsTab: React.FC = () => {
  const [page, setPage] = React.useState(1)
  const pageSize = 20

  const [status, setStatus] = React.useState<'' | BookingStatus>('')

  const [userOpt, setUserOpt] = React.useState<SearchOption<UserDTO> | null>(null)
  const [roomOpt, setRoomOpt] = React.useState<SearchOption<RoomDTO> | null>(null)
  const [roomTypeOpt, setRoomTypeOpt] = React.useState<SearchOption<RoomTypeWithoutRoomsDTO> | null>(null)

  const [from, setFrom] = React.useState<string>('')
  const [to, setTo] = React.useState<string>('')

  const [checkInFrom, setCheckInFrom] = React.useState<string>('')
  const [checkInTo, setCheckInTo] = React.useState<string>('')
  const [checkOutFrom, setCheckOutFrom] = React.useState<string>('')
  const [checkOutTo, setCheckOutTo] = React.useState<string>('')

  const [sortBy, setSortBy] = React.useState<'checkIn' | 'createdAt' | 'totalPrice'>('checkIn')
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc')

  const [showAdvanced, setShowAdvanced] = React.useState(false)

  const listParams = {
    page,
    pageSize,
    status: status || undefined,
    userId: userOpt?.value,
    roomId: roomOpt?.value,
    roomTypeId: roomTypeOpt?.value,
    from: toDateTimeParam(from),
    to: toDateTimeParam(to),
    checkInFrom: toDateTimeParam(checkInFrom),
    checkInTo: toDateTimeParam(checkInTo),
    checkOutFrom: toDateTimeParam(checkOutFrom),
    checkOutTo: toDateTimeParam(checkOutTo),
    sortBy,
    sortDir,
  }

  const { data: listData, isLoading: loading, isFetching, isPlaceholderData, error, refetch: refetchMain } = useBookingsList(listParams)
  const items = listData?.items ?? []
  const total = listData?.total ?? 0

  const { todayIn, todayOut, todayLoading, todayError, refetchToday } = useBookingsToday()
  const invalidate = useInvalidateBookings()

  const [editOpen, setEditOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<BookingDTO | null>(null)

  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const [bookingToCancel, setBookingToCancel] = React.useState<BookingDTO | null>(null)

  const loadUsers = React.useCallback(async (q: string) => {
    const res = await userRequests.getAll({ page: 1, pageSize: 10, search: q || undefined })
    return res.items.map((u) => ({
      value: u.id,
      label: `${u.login}${u.email ? ` • ${u.email}` : ''}`,
      raw: u,
    }))
  }, [])

  const loadRooms = React.useCallback(async (q: string) => {
    const res = await roomRequests.getAll({ page: 1, pageSize: 10, search: q || undefined, sortBy: 'number', sortDir: 'asc' })
    return res.items.map((r) => ({
      value: r.id,
      label: `Комната ${r.number}${r.roomType?.name ? ` • ${r.roomType.name}` : ''}`,
      raw: r,
    }))
  }, [])

  const loadRoomTypes = React.useCallback(async (q: string) => {
    const res = await roomTypesRequests.getAll({ page: 1, pageSize: 10, search: q || undefined, sortBy: 'name', sortDir: 'asc' })
    return res.items.map((t) => ({
      value: t.id,
      label: `${t.name} • до ${t.capacity}`,
      raw: t,
    }))
  }, [])

  const refreshAll = async () => {
    invalidate()
    await Promise.all([refetchToday(), refetchMain()])
  }

  const openCancelConfirm = (b: BookingDTO) => {
    setBookingToCancel(b)
    setConfirmOpen(true)
  }

  const doCancel = async () => {
    if (!bookingToCancel) return
    try {
      setConfirmLoading(true)
      await bookingRequests.cancel(bookingToCancel.id)
      setConfirmOpen(false)
      setBookingToCancel(null)
      invalidate()
      await Promise.all([refetchToday(), refetchMain()])
    } catch (e) {
      alert(getApiErrorMessage(e))
    } finally {
      setConfirmLoading(false)
    }
  }

  const applyCheckInsTodayToMain = () => {
    const { start, end } = todayRangeDateOnly()
    setPage(1)
    setStatus('')
    setUserOpt(null)
    setRoomOpt(null)
    setRoomTypeOpt(null)
    setFrom('')
    setTo('')
    setCheckInFrom(start)
    setCheckInTo(end)
    setCheckOutFrom('')
    setCheckOutTo('')
    setSortBy('checkIn')
    setSortDir('asc')
  }

  const applyCheckOutsTodayToMain = () => {
    const { start, end } = todayRangeDateOnly()
    setPage(1)
    setStatus('')
    setUserOpt(null)
    setRoomOpt(null)
    setRoomTypeOpt(null)
    setFrom('')
    setTo('')
    setCheckInFrom('')
    setCheckInTo('')
    setCheckOutFrom(start)
    setCheckOutTo(end)
    setSortBy('checkIn')
    setSortDir('asc')
  }

  const resetAllFilters = () => {
    setPage(1)
    setStatus('')
    setUserOpt(null)
    setRoomOpt(null)
    setRoomTypeOpt(null)
    setFrom('')
    setTo('')
    setCheckInFrom('')
    setCheckInTo('')
    setCheckOutFrom('')
    setCheckOutTo('')
    setSortBy('checkIn')
    setSortDir('desc')
  }

  const renderMiniRow = (b: BookingDTO) => {
    const inD = toDate(b.checkIn)
    const outD = toDate(b.checkOut)
    const isCancelled = b.status === 'Cancelled'
    const isCompleted = b.status === 'Completed'
    const cantCancel = isCancelled || isCompleted

    return (
      <div key={b.id} className={s.miniRow}>
        <div className={s.miniMain}>
          <div className={s.miniTitle}>#{b.id.slice(0, 8)}</div>
          <div className={s.miniSub}>
            {b.login} • комн. {b.number} • {bookingStatusRu(b.status)}
          </div>
          <div className={s.miniSub}>
            {inD ? dateFmt.format(inD) : '—'} → {outD ? dateFmt.format(outD) : '—'}
          </div>
        </div>

        <button
          className={clsx('btn', 'btn-ghost', s.miniBtn)}
          onClick={() => openCancelConfirm(b)}
          disabled={cantCancel}
          title={isCancelled ? 'Бронь уже отменена' : isCompleted ? 'Бронь завершена' : 'Отменить бронь'}
        >
          {isCancelled ? 'Отменена' : 'Отменить'}
        </button>
      </div>
    )
  }

  const confirmText = React.useMemo(() => {
    if (!bookingToCancel) return ''
    const inD = toDate(bookingToCancel.checkIn)
    const outD = toDate(bookingToCancel.checkOut)
    return [
      `Бронь #${bookingToCancel.id.slice(0, 8)}`,
      `Пользователь: ${bookingToCancel.login}`,
      `Комната: ${bookingToCancel.number}`,
      `Даты: ${inD ? dateFmt.format(inD) : bookingToCancel.checkIn} → ${outD ? dateFmt.format(outD) : bookingToCancel.checkOut}`,
      `Статус: ${bookingStatusRu(bookingToCancel.status)}`,
    ].join('\n')
  }, [bookingToCancel])

  return (
    <>
      <AdminSection
        title="Брони"
        actions={
          <AdminListToolbar
            filters={
              <>
                <select
                  className="select"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value as any)
                    setPage(1)
                  }}
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>

                <div className={s.range}>
                  <div className={s.rangeTitle}>Заезд</div>

                  <div className={s.rangeItem}>
                    <span className={s.rangeKey}>с</span>
                    <input
                      className="input"
                      type="date"
                      value={checkInFrom}
                      onChange={(e) => {
                        setCheckInFrom(e.target.value)
                        setPage(1)
                      }}
                    />
                  </div>

                  <div className={s.rangeItem}>
                    <span className={s.rangeKey}>по</span>
                    <input
                      className="input"
                      type="date"
                      value={checkInTo}
                      onChange={(e) => {
                        setCheckInTo(e.target.value)
                        setPage(1)
                      }}
                    />
                  </div>
                </div>

                <button type="button" className={clsx('btn', 'btn-ghost')} onClick={() => setShowAdvanced((v) => !v)}>
                  {showAdvanced ? 'Скрыть' : 'Дополнительно'}
                </button>

                {showAdvanced && (
                  <div className={s.advancedBlock}>
                    <div className={s.range}>
                      <div className={s.rangeTitle}>Выезд</div>

                      <div className={s.rangeItem}>
                        <span className={s.rangeKey}>с</span>
                        <input
                          className="input"
                          type="date"
                          value={checkOutFrom}
                          onChange={(e) => {
                            setCheckOutFrom(e.target.value)
                            setPage(1)
                          }}
                        />
                      </div>

                      <div className={s.rangeItem}>
                        <span className={s.rangeKey}>по</span>
                        <input
                          className="input"
                          type="date"
                          value={checkOutTo}
                          onChange={(e) => {
                            setCheckOutTo(e.target.value)
                            setPage(1)
                          }}
                        />
                      </div>
                    </div>

                    <div className={s.range}>
                      <div className={s.rangeTitle}>Период проживания</div>

                      <div className={s.rangeItem}>
                        <span className={s.rangeKey}>с</span>
                        <input
                          className="input"
                          type="date"
                          value={from}
                          onChange={(e) => {
                            setFrom(e.target.value)
                            setPage(1)
                          }}
                        />
                      </div>

                      <div className={s.rangeItem}>
                        <span className={s.rangeKey}>по</span>
                        <input
                          className="input"
                          type="date"
                          value={to}
                          onChange={(e) => {
                            setTo(e.target.value)
                            setPage(1)
                          }}
                        />
                      </div>
                    </div>

                    <div className={s.searchContainer}>
                      <EntitySearchSelect
                        value={userOpt}
                        onChange={(v) => {
                          setUserOpt(v)
                          setPage(1)
                        }}
                        loadOptions={loadUsers}
                        placeholder="Пользователь"
                      />

                      <EntitySearchSelect
                        value={roomOpt}
                        onChange={(v) => {
                          setRoomOpt(v)
                          setPage(1)
                        }}
                        loadOptions={loadRooms}
                        placeholder="Комната"
                      />

                      <EntitySearchSelect
                        value={roomTypeOpt}
                        onChange={(v) => {
                          setRoomTypeOpt(v)
                          setPage(1)
                        }}
                        loadOptions={loadRoomTypes}
                        placeholder="Тип комнаты"
                      />
                    </div>
                  </div>
                )}
              </>
            }
            sort={
              <>
                <select
                  className="select"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any)
                    setPage(1)
                  }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>

                <select
                  className="select"
                  value={sortDir}
                  onChange={(e) => {
                    setSortDir(e.target.value as any)
                    setPage(1)
                  }}
                >
                  <option value="desc">По убыванию</option>
                  <option value="asc">По возрастанию</option>
                </select>
              </>
            }
            actions={
              <>
                <button className={clsx('btn', 'btn-ghost')} type="button" onClick={refreshAll} disabled={loading}>
                  Обновить всё
                </button>

                <button className={clsx('btn', 'btn-ghost')} type="button" onClick={resetAllFilters}>
                  Сбросить
                </button>
              </>
            }
          />
        }
      >
        <div className={s.todayGrid}>
          <div className={s.todayCard}>
            <div className={s.todayHead}>
              <div className={s.todayTitle}>Заезды сегодня</div>
              <button className={clsx('btn', 'btn-ghost', s.todayBtn)} type="button" onClick={applyCheckInsTodayToMain}>
                Показать все заезды
              </button>
            </div>

            {todayError && <div className={s.error}>{getApiErrorMessage(todayError)}</div>}
            {todayLoading ? (
              <div className={s.muted}>Загрузка…</div>
            ) : todayIn.length === 0 ? (
              <div className={s.muted}>Нет заездов сегодня.</div>
            ) : (
              <div className={s.miniList}>{todayIn.map(renderMiniRow)}</div>
            )}
          </div>

          <div className={s.todayCard}>
            <div className={s.todayHead}>
              <div className={s.todayTitle}>Выезды сегодня</div>
              <button className={clsx('btn', 'btn-ghost', s.todayBtn)} type="button" onClick={applyCheckOutsTodayToMain}>
                Показать все выезды
              </button>
            </div>

            {todayError && <div className={s.error}>{getApiErrorMessage(todayError)}</div>}
            {todayLoading ? (
              <div className={s.muted}>Загрузка…</div>
            ) : todayOut.length === 0 ? (
              <div className={s.muted}>Нет выездов сегодня.</div>
            ) : (
              <div className={s.miniList}>{todayOut.map(renderMiniRow)}</div>
            )}
          </div>
        </div>

        {error && <div className={s.error}>{getApiErrorMessage(error)}</div>}
        {(isFetching && isPlaceholderData) && <div className={s.muted} style={{ fontSize: 12 }}>Обновление…</div>}

        {loading && !listData ? (
          <div className={s.muted}>Загрузка…</div>
        ) : (
          <>
            <div className={s.list}>
              {items.map((b) => {
                const inD = toDate(b.checkIn)
                const outD = toDate(b.checkOut)
                const createdD = toDate(b.createdAt)
                const isCancelled = b.status === 'Cancelled'
                const isCompleted = b.status === 'Completed'
                const cantCancel = isCancelled || isCompleted

                return (
                  <div key={b.id} className={s.rowCard}>
                    <div className={s.rowMain}>
                      <div className={s.rowTitle}>Бронь #{b.id.slice(0, 8)}</div>
                      <div className={s.rowSub}>
                        Логин: {b.login} • Комната: {b.number} • Гостей: {b.guestsCount}
                        {inD && outD ? ` • ${dateFmt.format(inD)} → ${dateFmt.format(outD)}` : ''}
                        {createdD ? ` • создано: ${dateFmt.format(createdD)}` : ''}
                        {' • статус: '}
                        {bookingStatusRu(b.status)}
                      </div>
                    </div>

                    <div className={s.rowActions}>
                      <button
                        className={clsx('btn', 'btn-ghost')}
                        onClick={() => {
                          setEditing(b)
                          setEditOpen(true)
                        }}
                        disabled={cantCancel}
                      >
                        Редактировать
                      </button>

                      <button
                        className={clsx('btn', 'btn-ghost')}
                        onClick={() => openCancelConfirm(b)}
                        disabled={cantCancel}
                        title={isCancelled ? 'Бронь уже отменена' : isCompleted ? 'Бронь завершена' : 'Отменить бронь'}
                      >
                        {isCancelled ? 'Отменена' : 'Отменить'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
          </>
        )}
      </AdminSection>

      <ConfirmModal
        open={confirmOpen}
        variant="danger"
        title="Отменить бронь?"
        text={confirmText}
        confirmText="Отменить"
        cancelText="Не отменять"
        loading={confirmLoading}
        onClose={() => {
          if (confirmLoading) return
          setConfirmOpen(false)
          setBookingToCancel(null)
        }}
        onConfirm={doCancel}
      />

      <BookingEditModal
        open={editOpen}
        booking={editing}
        onClose={() => {
          setEditOpen(false)
          setEditing(null)
        }}
        onSave={async (payload) => {
          await bookingRequests.update(editing!.id, {
            checkIn: new Date(payload.checkIn + 'T00:00:00Z'),
            checkOut: new Date(payload.checkOut + 'T00:00:00'),
            guestsCount: payload.guestsCount,
          })
          await refreshAll()
        }}
      />
    </>
  )
}

export default BookingsTab