import React from 'react'
import clsx from 'clsx'

import { useAuth } from '../../auth/AuthProvider'
import { bookingRequests, userRequests } from '../../api'
import { getApiErrorMessage } from '../../api/getApiErrorMessage'

import type { BookingDTO } from '../../types/bookingDTOs'
import type { UserDTO, UpdateUserDTO } from '../../types/userDTOs'
import { bookingStatusRu } from '../../shared/labels';

import s from './profile.module.scss'


const dateFmt = new Intl.DateTimeFormat('ru-RU', { year: 'numeric', month: '2-digit', day: '2-digit' })
const priceFmt = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })

const toDate = (v: any) => {
  if (!v) return null
  const d = v instanceof Date ? v : new Date(v)
  return Number.isNaN(d.getTime()) ? null : d
}

const MS_DAY = 24 * 60 * 60 * 1000

const Profile: React.FC = () => {
  const { user, logout, refreshMe } = useAuth()

  const [profileLoading, setProfileLoading] = React.useState(false)
  const [profileError, setProfileError] = React.useState<string | null>(null)

  const [form, setForm] = React.useState<UpdateUserDTO>({
    email: user?.email ?? '',
    phoneNumber: user?.phoneNumber ?? '',
  })

  const [bookings, setBookings] = React.useState<BookingDTO[]>([])
  const [bookingsLoading, setBookingsLoading] = React.useState(false)
  const [bookingsError, setBookingsError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setForm({
      email: user?.email ?? '',
      phoneNumber: user?.phoneNumber ?? '',
    })
  }, [user?.id, user?.email, user?.phoneNumber])

  const canCancelByStatus = (status: string) => status === 'Created' || status === 'Confirmed'

  const startOfDayTs = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()

  const getCancelBlockReason = (status: string, checkIn: Date | null) => {
    if (!canCancelByStatus(status)) return 'Эту бронь нельзя отменить по статусу.'
    if (!checkIn) return null

    const left = daysUntil(checkIn)
    if (left < 3) return 'До заезда осталось менее 3 дней. Отмена через поддержку.'
    return null
  }

  const daysUntil = (date: Date) => {
    const diff = startOfDayTs(date) - startOfDayTs(new Date())
    return Math.ceil(diff / MS_DAY)
  }

  const loadBookings = React.useCallback(async () => {
    setBookingsError(null)
    setBookingsLoading(true)
    try {
      const data = await bookingRequests.getMy()
      setBookings(data)
    } catch (e) {
      setBookings([])
      setBookingsError(getApiErrorMessage(e))
    } finally {
      setBookingsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    refreshMe()
    loadBookings()
  }, [refreshMe, loadBookings])

  const onSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError(null)

    if (!user?.id) {
      setProfileError('Не удалось определить пользователя')
      return
    }
    if (!form.email.trim() || !form.phoneNumber.trim()) {
      setProfileError('Заполните email и номер телефона')
      return
    }

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

  const onCancelBooking = async (id: string) => {
    const ok = window.confirm('Отменить бронь?')
    if (!ok) return

    try {
      await bookingRequests.cancel(id)
      await loadBookings()
    } catch (e) {
      alert(getApiErrorMessage(e))
    }
  }

  const me: UserDTO | null = user ?? null

  return (
    <main className={s.page}>
      <div className={clsx('br-container', s.grid)}>
        <section className={s.card}>
          <div className={s.cardHead}>
            <h1 className={s.h1}>Личный кабинет</h1>
            <button type="button" className={clsx('btn', 'btn-ghost')} onClick={logout}>
              Выйти
            </button>
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
              <input
                className="input"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
            </label>

            <label className={s.label}>
              Телефон
              <input
                className="input"
                value={form.phoneNumber}
                onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))}
              />
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
            <button className={clsx('btn', 'btn-ghost')} type="button" onClick={loadBookings} disabled={bookingsLoading}>
              {bookingsLoading ? 'Обновляем…' : 'Обновить'}
            </button>
          </div>

          {bookingsError && <div className={s.error}>{bookingsError}</div>}

          {bookingsLoading ? (
            <div className={s.muted}>Загружаем бронирования…</div>
          ) : bookings.length === 0 ? (
            <div className={s.muted}>У вас пока нет бронирований.</div>
          ) : (
            <div className={s.bookingList}>
              {bookings.map((b) => {
                const inD = toDate((b as any).checkIn)
                const outD = toDate((b as any).checkOut)

                const statusRaw = String((b as any).status)
                const blockReason = getCancelBlockReason(statusRaw, inD)

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
                        <span className={s.val}>{(b as any).guestsCount}</span>
                      </div>

                      <div className={s.row}>
                        <span className={s.key}>Стоимость</span>
                        <span className={s.val}>
                          {typeof (b as any).totalPrice === 'number'
                            ? priceFmt.format((b as any).totalPrice)
                            : '—'}
                        </span>
                      </div>
                    </div>

                    <div className={s.bookingActions}>
                      <button
                        type="button"
                        className={clsx('btn', 'btn-ghost')}
                        aria-disabled={Boolean(blockReason)} 
                        onClick={() => {
                          if (blockReason) {
                            alert(blockReason + '\n\nПозвоните в поддержку.')
                            return
                          }
                          onCancelBooking(b.id)
                        }}
                      >
                        Отменить
                      </button>
                    </div>

                    {blockReason && (
                      <div className={s.cancelHint}>
                        До заезда осталось менее 3 дней — отмена через поддержку.
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div >
    </main >
  )
}

export default Profile