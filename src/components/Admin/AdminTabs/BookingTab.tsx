import React from 'react'
import clsx from 'clsx'

import AdminSection from '../AdminSection'
import { bookingRequests } from '../../../api'
import { getApiErrorMessage } from '../../../api/getApiErrorMessage'
import type { BookingDTO } from '../../../types/bookingDTOs'
import { bookingStatusRu } from '../../../shared/labels'
import s from "../../../pages/Admin/admin.module.scss"

const BookingsTab: React.FC = () => {
  const [items, setItems] = React.useState<BookingDTO[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await bookingRequests.getAll()
      setItems(data)
    } catch (e) {
      setItems([])
      setError(getApiErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => { load() }, [load])

  const cancel = async (id: string) => {
    if (!window.confirm('Отменить бронь?')) return
    try {
      await bookingRequests.cancel(id)
      await load()
    } catch (e) {
      alert(getApiErrorMessage(e))
    }
  }

  return (
    <AdminSection
      title="Брони"
      actions={<button className={clsx('btn', 'btn-ghost')} onClick={load} disabled={loading}>Обновить</button>}
    >
      {error && <div className={s.error}>{error}</div>}
      {loading ? (
        <div className={s.muted}>Загрузка…</div>
      ) : (
        <div className={s.list}>
          {items.map((b) => (
            <div key={b.id} className={s.rowCard}>
              <div className={s.rowMain}>
                <div className={s.rowTitle}>Бронь #{b.id.slice(0, 8)}</div>
                <div className={s.rowSub}>
                  user: {(b as any).userId} • roomId: {(b as any).roomId} • статус: {bookingStatusRu(String((b as any).status))}
                </div>
              </div>
              <div className={s.rowActions}>
                <button className={clsx('btn', 'btn-ghost')} onClick={() => cancel(b.id)}>Отменить</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminSection>
  )
}

export default BookingsTab