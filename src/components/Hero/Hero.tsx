import React from 'react'
import clsx from 'clsx'
import s from './hero.module.scss'

type Props = {
    loading?: boolean
    onSearch: (params: { guests: number; checkIn: string; checkOut: string }) => void | Promise<void>
}

const pad2 = (n: number) => String(n).padStart(2, '0')

// YYYY-MM-DD в локальной зоне
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
    const [checkIn, setCheckIn] = React.useState<string>('')   // YYYY-MM-DD
    const [checkOut, setCheckOut] = React.useState<string>('') // YYYY-MM-DD
    const [error, setError] = React.useState<string | null>(null)

    // Минимальная дата выезда:
    // - если выбран checkIn -> на следующий день (чтобы выезд был позже заезда)
    // - иначе -> сегодня
    const minCheckOut = checkIn ? addDays(checkIn, 1) : today

    const validate = () => {
        if (!Number.isFinite(guests) || guests < 1) return 'Количество гостей должно быть 1 или больше'
        if (!checkIn) return 'Выберите дату заезда'
        if (!checkOut) return 'Выберите дату выезда'
        if (checkIn < today) return 'Дата заезда не может быть раньше сегодняшней'
        if (checkOut < minCheckOut) return 'Дата выезда должна быть позже даты заезда'
        return null
    }

    // Если поменяли checkIn так, что текущий checkOut стал некорректным — сбросим его
    React.useEffect(() => {
        if (checkOut && checkOut < minCheckOut) {
            setCheckOut('')
        }
    }, [checkIn]) // eslint-disable-line react-hooks/exhaustive-deps

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
                        <input
                            className="input"
                            type="number"
                            min={1}
                            step={1}
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                            aria-label="Гости"
                        />

                        <input
                            className="input"
                            type="date"
                            value={checkIn}
                            min={today}                 
                            onChange={(e) => setCheckIn(e.target.value)}
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