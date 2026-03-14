import React from 'react'
import clsx from 'clsx'

import ConfirmModal from '../../modals/ConfirmModal/ConfirmModal'
import Pagination from '../../components/Pagination/Pagination'

import { useAuth } from '../../auth/AuthProvider'
import { useMyBookings } from '../../api/queries'
import { bookingRequests, userRequests } from '../../api'
import { getApiErrorMessage } from '../../api/getApiErrorMessage'

import type { BookingDTO } from '../../types/bookingDTOs'
import type { UserDTO, UpdateUserDTO } from '../../types/userDTOs'
import { bookingStatusRu } from '../../shared/labels'

import s from './profile.module.scss'

const dateFmt = new Intl.DateTimeFormat('ru-RU', { year: 'numeric', month: '2-digit', day: '2-digit' })
const priceFmt = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })

const toDate = (v: any) => {
  if (!v) return null
  const d = v instanceof Date ? v : new Date(v)
  return Number.isNaN(d.getTime()) ? null : d
}

const MS_DAY = 24 * 60 * 60 * 1000
const startOfDayTs = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
const daysUntil = (date: Date) => Math.ceil((startOfDayTs(date) - startOfDayTs(new Date())) / MS_DAY)

const canCancelByStatus = (status: string) => status === 'Created' || status === 'Confirmed'
const toDateTimeParam = (d: string) => (d ? `${d}T00:00:00` : undefined)

const pad2 = (n: number) => String(n).padStart(2, '0')
const todayDateOnly = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

const Profile: React.FC = () => {
  const { user, refreshMe } = useAuth()

  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const [bookingToCancel, setBookingToCancel] = React.useState<BookingDTO | null>(null)

  const [profileLoading, setProfileLoading] = React.useState(false)
  const [profileError, setProfileError] = React.useState<string | null>(null)

  const [form, setForm] = React.useState<UpdateUserDTO>({
    email: user?.email ?? '',
    phoneNumber: user?.phoneNumber ?? '',
  })

  const [status, setStatus] = React.useState<'' | 'Created' | 'Confirmed' | 'Cancelled' | 'Completed'>('')
  const [checkInFrom, setCheckInFrom] = React.useState<string>('')
  const [checkInTo, setCheckInTo] = React.useState<string>('')

  const [mode, setMode] = React.useState<'upcoming' | 'all' | 'past'>('upcoming')
  const [page, setPage] = React.useState(1)
  const pageSize = 10

  const today = todayDateOnly()
  const { data, isLoading: bookingsLoading, isFetching, isPlaceholderData, error: bookingsError, refetch: loadBookings } = useMyBookings({
    page,
    pageSize,
    status: status || undefined,
    checkInFrom: mode === 'upcoming' ? toDateTimeParam(today) : toDateTimeParam(checkInFrom),
    checkInTo: mode === 'past' ? toDateTimeParam(today) : toDateTimeParam(checkInTo),
    sortBy: 'checkIn',
    sortDir: mode === 'upcoming' ? 'asc' : 'desc',
  })

  const bookings = data?.items ?? []
  const total = data?.total ?? 0

  React.useEffect(() => {
    setForm({
      email: user?.email ?? '',
      phoneNumber: user?.phoneNumber ?? '',
    })
  }, [user?.id, user?.email, user?.phoneNumber])

  React.useEffect(() => {
    refreshMe()
  }, [refreshMe])

  const onSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError(null)

    if (!user?.id) return setProfileError('Не удалось определить пользователя')
    if (!form.email.trim() || !form.phoneNumber.trim()) return setProfileError('Заполните email и номер телефона')

    try {
      setProfileLoading(true)
      await userRequests.update(user.id, {
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
      })
      await refreshMe()
    } catch (err) {
      setProfileError(getApiErrorMessage(err))
    } finally {
      setProfileLoading(false)
    }
  }

  const openCancelConfirm = (b: BookingDTO) => {
    const inD = toDate(b.checkIn)
    const statusRaw = String(b.status)

    if (!canCancelByStatus(statusRaw)) {
      alert('Эту бронь нельзя отменить по статусу.')
      return
    }

    if (inD && daysUntil(inD) < 3) {
      alert('До заезда осталось менее 3 дней. Отмена через поддержку.\nПозвоните в поддержку.')
      return
    }

    setBookingToCancel(b)
    setConfirmOpen(true)
  }

  const me: UserDTO | null = user ?? null

  return (
    <main className={s.page}>
      <div className={clsx('br-container', s.grid)}>
        <section className={s.card}>
          <div className={s.cardHead}>
            <h1 className={s.h1}>Личный кабинет</h1>
          </div>

          <div className={s.profileMeta}>
            <div className={s.metaRow}>
              <span className={s.metaKey}>Логин</span>
              <span className={s.metaVal}>{me?.login ?? '—'}</span>
            </div>
          </div>

          <form className={s.form} onSubmit={onSaveProfile}>
            <label className={s.label}>
              Email
              <input className="input" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </label>

            <label className={s.label}>
              Телефон
              <input className="input" value={form.phoneNumber} onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))} />
            </label>

            {profileError && <div className={s.error}>{profileError}</div>}

            <div className={s.actions}>
              <button className={clsx('btn', 'btn-primary')} type="submit" disabled={profileLoading}>
                {profileLoading ? 'Сохраняем…' : 'Сохранить'}
              </button>
              <button className={clsx('btn')} type="button" onClick={() => refreshMe()}>
                Обновить
              </button>
            </div>
          </form>
        </section>

        <section className={s.card}>
          <div className={s.cardHead}>
            <h2 className={s.h2}>Мои бронирования</h2>

            <div className={s.filters}>
              <select
                className="select"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as any)
                  setPage(1)
                }}
              >
                <option value="">Все статусы</option>
                <option value="Created">Создано</option>
                <option value="Confirmed">Подтверждено</option>
                <option value="Cancelled">Отменено</option>
                <option value="Completed">Завершено</option>
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

              <button
                type="button"
                className={clsx('btn', 'btn-ghost')}
                onClick={() => {
                  setStatus('')
                  setCheckInFrom('')
                  setCheckInTo('')
                  setPage(1)
                }}
              >
                Сбросить
              </button>

              <div className={clsx(s.buttonsConteiner)}>
                <button
                  type="button"
                  className={clsx('btn', mode === 'upcoming' ? 'btn-primary' : 'btn-ghost')}
                  onClick={() => { setMode('upcoming'); setPage(1) }}
                >
                  Предстоящие
                </button>

                <button
                  type="button"
                  className={clsx('btn', mode === 'all' ? 'btn-primary' : 'btn-ghost')}
                  onClick={() => { setMode('all'); setPage(1) }}
                >
                  Все
                </button>

                <button
                  type="button"
                  className={clsx('btn', mode === 'past' ? 'btn-primary' : 'btn-ghost')}
                  onClick={() => { setMode('past'); setPage(1) }}
                >
                  История
                </button>
              </div>
            </div>
            <button className={clsx('btn', 'btn-ghost')} type="button" onClick={() => loadBookings()} disabled={bookingsLoading}>
              {bookingsLoading ? 'Обновляем…' : 'Обновить'}
            </button>
          </div>

          {bookingsError && <div className={s.error}>{getApiErrorMessage(bookingsError)}</div>}
          {(isFetching && isPlaceholderData) && (
            <div className={s.muted} style={{ fontSize: 12 }}>Обновление…</div>
          )}

          {bookingsLoading && !data ? (
            <div className={s.muted}>Загружаем бронирования…</div>
          ) : bookings.length === 0 ? (
            <div className={s.muted}>У вас пока нет бронирований.</div>
          ) : (
            <>
              <div className={s.bookingList}>
                {bookings.map((b) => {
                  const inD = toDate(b.checkIn)
                  const outD = toDate(b.checkOut)
                  const statusRaw = String(b.status)

                  const blockedByDays = inD ? daysUntil(inD) < 3 : false
                  const blocked = !canCancelByStatus(statusRaw) || blockedByDays

                  return (
                    <div key={b.id} className={s.booking}>
                      <div className={s.bookingTop}>
                        <div className={s.bookingTitle}>Бронь #{b.id.slice(0, 8)}</div>
                        <div className={s.badge}>{bookingStatusRu(statusRaw)}</div>
                      </div>

                      <div className={s.bookingRows}>
                        <div className={s.row}>
                          <span className={s.key}>Даты</span>
                          <span className={s.val}>
                            {inD ? dateFmt.format(inD) : '—'} → {outD ? dateFmt.format(outD) : '—'}
                          </span>
                        </div>

                        <div className={s.row}>
                          <span className={s.key}>Гостей</span>
                          <span className={s.val}>{b.guestsCount}</span>
                        </div>

                        <div className={s.row}>
                          <span className={s.key}>Стоимость</span>
                          <span className={s.val}>{priceFmt.format(b.totalPrice)}</span>
                        </div>
                      </div>

                      <div className={s.bookingActions}>
                        <button
                          type="button"
                          className={clsx('btn', 'btn-ghost')}
                          aria-disabled={blocked}
                          onClick={() => openCancelConfirm(b)}
                        >
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
        </section>
      </div>

      <ConfirmModal
        open={confirmOpen}
        variant="danger"
        title="Отменить бронь?"
        text={
          bookingToCancel
            ? `Бронь #${bookingToCancel.id.slice(0, 8)}\nКомната: ${bookingToCancel.number}\nДаты: ${bookingToCancel.checkIn} → ${bookingToCancel.checkOut}`
            : ''
        }
        confirmText="Отменить"
        cancelText="Не отменять"
        loading={confirmLoading}
        onClose={() => {
          if (confirmLoading) return
          setConfirmOpen(false)
          setBookingToCancel(null)
        }}
        onConfirm={async () => {
          if (!bookingToCancel) return
          try {
            setConfirmLoading(true)
            await bookingRequests.cancel(bookingToCancel.id)
            await loadBookings()
            setConfirmOpen(false)
            setBookingToCancel(null)
          } finally {
            setConfirmLoading(false)
          }
        }}
      />
    </main>
  )
}

export default Profile