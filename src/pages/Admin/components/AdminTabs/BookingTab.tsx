import React from 'react'
import clsx from 'clsx'

import AdminSection from '../AdminSection'
import Pagination from '../../../../components/Pagination/Pagination'
import AdminListToolbar from '../AdminToolBar'

import { bookingRequests } from '../../../../api'
import { getApiErrorMessage } from '../../../../api/getApiErrorMessage'
import type { BookingDTO } from '../../../../types/bookingDTOs'
import { bookingStatusRu } from '../../../../shared/labels'
import BookingEditModal from '../../../../modals/BookingEditModal'

import s from '../../admin.module.scss'
import type { BookingStatus } from '../../../../api/booking/booking.request'

const dateFmt = new Intl.DateTimeFormat('ru-RU', { year: 'numeric', month: '2-digit', day: '2-digit' })

const toDate = (v: any) => {
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? null : d
}

const pad2 = (n: number) => String(n).padStart(2, '0')
const dateOnly = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
const toDateTimeParam = (d: string) => (d ? `${d}T00:00:00` : undefined)

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

const MINI_TAKE = 5

const BookingsTab: React.FC = () => {
  const [items, setItems] = React.useState<BookingDTO[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [page, setPage] = React.useState(1)
  const pageSize = 20
  const [total, setTotal] = React.useState(0)

  const [status, setStatus] = React.useState<'' | BookingStatus>('')

  const [userId, setUserId] = React.useState('')      
  const [roomId, setRoomId] = React.useState('')      
  const [roomTypeId, setRoomTypeId] = React.useState('') 

  const [from, setFrom] = React.useState<string>('')
  const [to, setTo] = React.useState<string>('')    

  const [checkInFrom, setCheckInFrom] = React.useState<string>('')   
  const [checkInTo, setCheckInTo] = React.useState<string>('')      
  const [checkOutFrom, setCheckOutFrom] = React.useState<string>('')
  const [checkOutTo, setCheckOutTo] = React.useState<string>('')     

  const [sortBy, setSortBy] = React.useState<'checkIn' | 'createdAt' | 'totalPrice'>('checkIn')
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc')

  const [showAdvanced, setShowAdvanced] = React.useState(false)

  const [todayIn, setTodayIn] = React.useState<BookingDTO[]>([])
  const [todayOut, setTodayOut] = React.useState<BookingDTO[]>([])
  const [todayLoading, setTodayLoading] = React.useState(false)
  const [todayError, setTodayError] = React.useState<string | null>(null)

  const [editOpen, setEditOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<BookingDTO | null>(null)

  const loadToday = React.useCallback(async () => {
    setTodayError(null)
    setTodayLoading(true)

    try {
      const { start, end } = todayRangeDateOnly()

      const inRes = await bookingRequests.getAll({
        page: 1,
        pageSize: MINI_TAKE,
        checkInFrom: toDateTimeParam(start),
        checkInTo: toDateTimeParam(end),
        sortBy: 'checkIn',
        sortDir: 'asc',
      })

      const outRes = await bookingRequests.getAll({
        page: 1,
        pageSize: MINI_TAKE,
        checkOutFrom: toDateTimeParam(start),
        checkOutTo: toDateTimeParam(end),
        sortBy: 'checkIn',
        sortDir: 'asc',
      })

      setTodayIn(inRes.items)
      setTodayOut(outRes.items)
    } catch (e) {
      setTodayIn([])
      setTodayOut([])
      setTodayError(getApiErrorMessage(e))
    } finally {
      setTodayLoading(false)
    }
  }, [])

  const loadMain = React.useCallback(async () => {
    setError(null)
    setLoading(true)

    try {
      const res = await bookingRequests.getAll({
        page,
        pageSize,

        status: status || undefined,
        userId: userId.trim() || undefined,
        roomId: roomId.trim() || undefined,
        roomTypeId: roomTypeId.trim() || undefined,

        from: toDateTimeParam(from),
        to: toDateTimeParam(to),

        checkInFrom: toDateTimeParam(checkInFrom),
        checkInTo: toDateTimeParam(checkInTo),
        checkOutFrom: toDateTimeParam(checkOutFrom),
        checkOutTo: toDateTimeParam(checkOutTo),

        sortBy,
        sortDir,
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
  }, [
    page,
    pageSize,
    status,
    userId,
    roomId,
    roomTypeId,
    from,
    to,
    checkInFrom,
    checkInTo,
    checkOutFrom,
    checkOutTo,
    sortBy,
    sortDir,
  ])

  React.useEffect(() => {
    loadToday()
  }, [loadToday])

  React.useEffect(() => {
    const t = setTimeout(() => loadMain(), 250)
    return () => clearTimeout(t)
  }, [loadMain])

  const refreshAll = async () => {
    await Promise.all([loadToday(), loadMain()])
  }

  const cancel = async (id: string) => {
    if (!window.confirm('Отменить бронь?')) return
    try {
      await bookingRequests.cancel(id)
      await refreshAll()
    } catch (e) {
      alert(getApiErrorMessage(e))
    }
  }

  const applyCheckInsTodayToMain = () => {
    const { start, end } = todayRangeDateOnly()
    setPage(1)
    setStatus('')
    setUserId('')
    setRoomId('')
    setRoomTypeId('')
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
    setUserId('')
    setRoomId('')
    setRoomTypeId('')
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
    setUserId('')
    setRoomId('')
    setRoomTypeId('')
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

        <button className={clsx('btn', 'btn-ghost', s.miniBtn)} onClick={() => cancel(b.id)}>
          Отменить
        </button>
      </div>
    )
  }

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

                <span>Заезды</span>

                <input
                  className="input"
                  type="date"
                  value={checkInFrom}
                  onChange={(e) => {
                    setCheckInFrom(e.target.value)
                    setPage(1)
                  }}
                  title="CheckInFrom"
                />
                <input
                  className="input"
                  type="date"
                  value={checkInTo}
                  onChange={(e) => {
                    setCheckInTo(e.target.value)
                    setPage(1)
                  }}
                  title="CheckInTo"
                />

                <button
                  type="button"
                  className={clsx('btn', 'btn-ghost')}
                  onClick={() => setShowAdvanced((v) => !v)}
                >
                  {showAdvanced ? 'Скрыть' : 'Дополнительно'}
                </button>

                {showAdvanced && (
                  <>
                    <span>Выезды</span>
                    <input
                      className="input"
                      type="date"
                      value={checkOutFrom}
                      onChange={(e) => {
                        setCheckOutFrom(e.target.value)
                        setPage(1)
                      }}
                      title="CheckOutFrom"
                    />
                    <input
                      className="input"
                      type="date"
                      value={checkOutTo}
                      onChange={(e) => {
                        setCheckOutTo(e.target.value)
                        setPage(1)
                      }}
                      title="CheckOutTo"
                    />

                    <span>From/To</span>
                    <input
                      className="input"
                      type="date"
                      value={from}
                      onChange={(e) => {
                        setFrom(e.target.value)
                        setPage(1)
                      }}
                      title="From (legacy)"
                    />
                    <input
                      className="input"
                      type="date"
                      value={to}
                      onChange={(e) => {
                        setTo(e.target.value)
                        setPage(1)
                      }}
                      title="To (legacy)"
                    />

                    <input
                      className="input"
                      value={userId}
                      onChange={(e) => {
                        setUserId(e.target.value)
                        setPage(1)
                      }}
                      placeholder="UserId (GUID)"
                      title="UserId"
                    />
                    <input
                      className="input"
                      value={roomId}
                      onChange={(e) => {
                        setRoomId(e.target.value)
                        setPage(1)
                      }}
                      placeholder="RoomId (GUID)"
                      title="RoomId"
                    />
                    <input
                      className="input"
                      value={roomTypeId}
                      onChange={(e) => {
                        setRoomTypeId(e.target.value)
                        setPage(1)
                      }}
                      placeholder="RoomTypeId (GUID)"
                      title="RoomTypeId"
                    />
                  </>
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
                <button className={clsx('btn', 'btn-ghost')} type="button" onClick={refreshAll} disabled={loading || todayLoading}>
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
        {/* TODAY WIDGETS */}
        <div className={s.todayGrid}>
          <div className={s.todayCard}>
            <div className={s.todayHead}>
              <div className={s.todayTitle}>Заезды сегодня</div>
              <button className={clsx('btn', 'btn-ghost', s.todayBtn)} type="button" onClick={applyCheckInsTodayToMain}>
                Показать все заезды
              </button>
            </div>

            {todayError && <div className={s.error}>{todayError}</div>}
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

            {todayError && <div className={s.error}>{todayError}</div>}
            {todayLoading ? (
              <div className={s.muted}>Загрузка…</div>
            ) : todayOut.length === 0 ? (
              <div className={s.muted}>Нет выездов сегодня.</div>
            ) : (
              <div className={s.miniList}>{todayOut.map(renderMiniRow)}</div>
            )}
          </div>
        </div>

        {/* MAIN LIST */}
        {error && <div className={s.error}>{error}</div>}

        {loading ? (
          <div className={s.muted}>Загрузка…</div>
        ) : (
          <>
            <div className={s.list}>
              {items.map((b) => {
                const inD = toDate(b.checkIn)
                const outD = toDate(b.checkOut)
                const createdD = toDate(b.createdAt)

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
                      >
                        Редактировать
                      </button>

                      <button className={clsx('btn', 'btn-ghost')} onClick={() => cancel(b.id)}>
                        Отменить
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

      <BookingEditModal
        open={editOpen}
        booking={editing}
        onClose={() => {
          setEditOpen(false)
          setEditing(null)
        }}
        onSave={async (payload) => {
          await bookingRequests.update(editing!.id, {
            checkIn: new Date(payload.checkIn + 'T00:00:00'),
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