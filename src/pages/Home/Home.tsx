import React from 'react'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'

import Hero from '../../components/Hero/Hero'
import TypeList from '../../components/TypeList/TypeCardList'
import TypeInfo from '../../components/TypeInfo/TypeInfo'
import AuthRequiredModal from '../../components/AuthRequiredModal/AuthRequiredModal'

import { roomTypesRequests, bookingRequests, tokenStorage } from '../../api'
import { getApiErrorMessage } from '../../api/getApiErrorMessage'
import type { RoomTypeWithoutRoomsDTO } from '../../types/roomTypeDTOs'

import { decodeJwt, getUserIdFromJwt } from '../../auth/jwt'
import s from './home.module.scss'
import { useAuth } from '../../auth/AuthProvider'

const toDateTime = (date: string) => `${date}T00:00:00`
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

    // 2) проверка авторизации
    if (!isAuth) {
      setAuthModalOpen(true)
      return
    }

    // 1) userId из jwt sub
    const token = tokenStorage.getAccess()
    const userId = token ? getUserIdFromJwt(decodeJwt(token)) : null
    if (!userId) {
      setAuthModalOpen(true)
      return
    }

    // подтверждение
    const ok = window.confirm(
      `Подтвердить бронирование?\n\n` +
        `${roomType.name}\n` +
        `Гостей: ${searchParams.guests}\n` +
        `Даты: ${searchParams.checkIn} → ${searchParams.checkOut}`
    )
    if (!ok) return

    try {
      setBookingLoading(true)

      await bookingRequests.create({
        userId,
        roomTypeId: roomType.id,
        checkIn: toDate(searchParams.checkIn),
        checkOut: toDate(searchParams.checkOut),
        guestsCount: searchParams.guests,
      })

      setOpen(false)
      nav('/profile') // после успеха ведём в личный кабинет
    } catch (e) {
      alert(getApiErrorMessage(e))
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <>
      <div className="main">
        <Hero
          loading={loading}
          onSearch={async (params) => {
            setSearchParams(params)   // 3) сохраняем поиск
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
                Name="Свободные номера"
              />
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
    </>
  )
}

export default Home