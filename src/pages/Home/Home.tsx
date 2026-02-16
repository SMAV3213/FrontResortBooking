import React from 'react'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'

import Hero from '../../components/Hero/Hero'
import TypeList from '../../components/TypeList/TypeCardList'
import TypeInfo from '../../components/TypeInfo/TypeInfo'
import AuthRequiredModal from '../../modals/AuthRequiredModal/AuthRequiredModal'
import ConfirmModal from '../../modals/ConfirmModal/ConfirmModal'

import { roomTypesRequests, bookingRequests, tokenStorage } from '../../api'
import { getApiErrorMessage } from '../../api/getApiErrorMessage'
import type { RoomTypeWithoutRoomsDTO } from '../../types/roomTypeDTOs'

import { decodeJwt, getUserIdFromJwt } from '../../auth/jwt'
import { useAuth } from '../../auth/AuthProvider'
import s from './home.module.scss'
import About from '../AboutUs/AboutUs'

const toDateTime = (date: string) => `${date}T00:00:00Z`
const toDate = (date: string) => new Date(toDateTime(date))
type SearchParams = { guests: number; checkIn: string; checkOut: string }

const Home: React.FC = () => {
  const nav = useNavigate()
  const { isAuth } = useAuth()

  const [items, setItems] = React.useState<RoomTypeWithoutRoomsDTO[]>([])
  const [loading, setLoading] = React.useState(false)
  const [showResults, setShowResults] = React.useState(false)

  const [searchParams, setSearchParams] = React.useState<SearchParams | null>(null)

  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [selected, setSelected] = React.useState<RoomTypeWithoutRoomsDTO | null>(null)
  const [open, setOpen] = React.useState(false)

  const [bookingLoading, setBookingLoading] = React.useState(false)
  const [authModalOpen, setAuthModalOpen] = React.useState(false)

  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const [pendingRoomType, setPendingRoomType] = React.useState<RoomTypeWithoutRoomsDTO | null>(null)

  const fetchAvailable = React.useCallback(async (params: SearchParams) => {
    setLoading(true)
    try {
      const data = await roomTypesRequests.getAvailable({
        guests: params.guests,
        checkIn: toDateTime(params.checkIn),
        checkOut: toDateTime(params.checkOut),
      })

      setItems(data)
      setSelectedId(data[0]?.id ?? null)
      setSelected(data[0] ?? null)
    } catch (e) {
      console.error(getApiErrorMessage(e))
      setItems([])
      setSelectedId(null)
      setSelected(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleBook = async (roomType: RoomTypeWithoutRoomsDTO) => {
    if (!searchParams) {
      alert('Сначала выполните поиск (даты и количество гостей).')
      return
    }

    if (!isAuth) {
      setAuthModalOpen(true)
      return
    }

    setPendingRoomType(roomType)
    setConfirmOpen(true)
  }

  const doCreateBooking = async () => {
    if (!pendingRoomType || !searchParams) return

    const token = tokenStorage.getAccess()
    const userId = token ? getUserIdFromJwt(decodeJwt(token)) : null
    if (!userId) {
      setConfirmOpen(false)
      setPendingRoomType(null)
      setAuthModalOpen(true)
      return
    }

    try {
      setConfirmLoading(true)
      setBookingLoading(true)

      await bookingRequests.create({
        userId,
        roomTypeId: pendingRoomType.id,
        checkIn: toDate(searchParams.checkIn),
        checkOut: toDate(searchParams.checkOut),
        guestsCount: searchParams.guests,
      })

      setOpen(false)
      setConfirmOpen(false)
      setPendingRoomType(null)

      nav('/profile')
    } catch (e) {
      alert(getApiErrorMessage(e))
    } finally {
      setConfirmLoading(false)
      setBookingLoading(false)
    }
  }

  const nightsBetween = (checkIn: string, checkOut: string) => {
    const [y1, m1, d1] = checkIn.split('-').map(Number)
    const [y2, m2, d2] = checkOut.split('-').map(Number)

    const t1 = Date.UTC(y1, m1 - 1, d1)
    const t2 = Date.UTC(y2, m2 - 1, d2)

    return Math.max(0, Math.round((t2 - t1) / (24 * 60 * 60 * 1000)))
  }

  const rubFmt = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  })

  const confirmText = React.useMemo(() => {
    if (!pendingRoomType || !searchParams) return ''

    const nights = nightsBetween(searchParams.checkIn, searchParams.checkOut)
    const total = pendingRoomType.pricePerNight * nights

    return [
      `Тип: ${pendingRoomType.name}`,
      `Гостей: ${searchParams.guests}`,
      `Даты: с ${searchParams.checkIn} по ${searchParams.checkOut}`,
      `Ночей: ${nights}`,
      `Цена за ночь: ${rubFmt.format(pendingRoomType.pricePerNight)}`,
      `Итого: ${rubFmt.format(total)}`,
    ].join('\n')
  }, [pendingRoomType, searchParams])

  return (
    <>
      <div className="main">
        <Hero
          loading={loading}
          onSearch={async (params) => {
            setSearchParams(params)
            setShowResults(true)
            await fetchAvailable(params)
          }}
        />

        <div className={clsx(s.reveal, showResults && s.revealOpen)}>
          <div className={s.revealBody}>
            <div>
              <TypeList
                items={items}
                selectedId={selectedId}
                onSelect={(item) => {
                  setSelectedId(item.id)
                  setSelected(item)
                  setOpen(true)
                }}
                columnsMinWidth={320}
                Name="Доступные номера"
              />
            </div>
          </div>
        </div>

        <div className={clsx(s['br-list'])}>
          <div className={clsx(s['br-list-overlay'])}>

            <div className={s.revealBody}>
              <div>
                <About />
              </div>
            </div>
          </div>
        </div>
      </div>

      <TypeInfo
        open={open}
        item={selected}
        onClose={() => setOpen(false)}
        showActions
        onBook={handleBook}
        bookingDisabled={bookingLoading}
      />

      <AuthRequiredModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <ConfirmModal
        open={confirmOpen}
        title="Подтвердить бронирование?"
        text={confirmText}
        confirmText="Забронировать"
        cancelText="Отмена"
        loading={confirmLoading}
        onClose={() => {
          if (confirmLoading) return
          setConfirmOpen(false)
          setPendingRoomType(null)
        }}
        onConfirm={doCreateBooking}
      />
    </>
  )
}

export default Home