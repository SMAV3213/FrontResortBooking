import React from 'react'
import clsx from 'clsx'
import s from './hero.module.scss'
import { GUEST_OPTIONS } from '../../shared/countArray'

type Props = {
    loading?: boolean
    onSearch: (params: { guests: number; checkIn: string; checkOut: string }) => void | Promise<void>
}

const pad2 = (n: number) => String(n).padStart(2, '0')

const toDateInput = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

const addDays = (dateStr: string, days: number) => {
    const [y, m, d] = dateStr.split('-').map(Number)
    const dt = new Date(y, m - 1, d)
    dt.setDate(dt.getDate() + days)
    return toDateInput(dt)
}

const Hero: React.FC<Props> = ({ loading, onSearch }) => {
    const today = React.useMemo(() => toDateInput(new Date()), [])

    const [guests, setGuests] = React.useState<number>(2)
    const [checkIn, setCheckIn] = React.useState<string>('')
    const [checkOut, setCheckOut] = React.useState<string>('')
    const [error, setError] = React.useState<string | null>(null)

    const minCheckOut = checkIn ? addDays(checkIn, 1) : today

    const validate = () => {
        if (!Number.isFinite(guests) || guests < 1) return 'Количество гостей должно быть 1 или больше'
        if (!checkIn) return 'Выберите дату заезда'
        if (!checkOut) return 'Выберите дату выезда'
        if (checkIn < today) return 'Дата заезда не может быть раньше сегодняшней'
        if (checkOut < minCheckOut) return 'Дата выезда должна быть позже даты заезда'
        return null
    }

    // ← вот ключевое изменение
    const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCheckIn = e.target.value
        setCheckIn(newCheckIn)

        if (newCheckIn) {
            const nextDay = addDays(newCheckIn, 1)

            // Если выезд не задан или стал <= заезду — подставляем заезд + 1
            if (!checkOut || checkOut <= newCheckIn) {
                setCheckOut(nextDay)
            }
        } else {
            setCheckOut('')
        }
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const msg = validate()
        if (msg) {
            setError(msg)
            return
        }
        setError(null)
        await onSearch({ guests, checkIn, checkOut })
    }

    return (
        <section className={clsx(s['br-hero'])}>
            <div className={clsx(s['br-hero-overlay'])}>
                <div className={clsx('br-container', s['br-hero-inner'])}>
                    <h1 className={clsx(s['br-hero-title'])}>Baikal Breeze</h1>
                    <p className={clsx(s['br-hero-sub'])}>Бронирование номеров на Байкале</p>

                    <form className={clsx(s['br-search'])} onSubmit={onSubmit}>
                        <select
                            className="select"
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                            aria-label="Гости"
                        >
                            {GUEST_OPTIONS.map((n) => (
                                <option key={n} value={n}>
                                    {n} {n === 1 ? 'гость' : n < 5 ? 'гостя' : 'гостей'}
                                </option>
                            ))}
                        </select>

                        <input
                            className="input"
                            type="date"
                            value={checkIn}
                            min={today}
                            onChange={handleCheckInChange}
                        />

                        <input
                            className="input"
                            type="date"
                            value={checkOut}
                            min={minCheckOut}
                            disabled={!checkIn}
                            onChange={(e) => setCheckOut(e.target.value)}
                        />

                        <button className={clsx('btn', 'btn-primary')} type="submit" disabled={loading}>
                            {loading ? 'Ищем…' : 'Найти'}
                        </button>

                        {error && <div className={s.searchError}>{error}</div>}
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Hero