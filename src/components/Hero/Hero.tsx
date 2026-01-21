import React from 'react'
import clsx from 'clsx'
import s from './hero.module.scss'

const Hero: React.FC = () => {
    return (
        <section className={clsx(s['br-hero'])}>
            <div className={clsx(s['br-hero-overlay'])}>
                <div className={clsx('br-container', s['br-hero-inner'])}>
                    <h1 className={clsx(s['br-hero-title'])}>Baikal Breeze</h1>
                    <p className={clsx(s['br-hero-sub'])}>Бронирование номеров на Байкале</p>

                    <form className={clsx(s['br-search'])} onSubmit={(e) => e.preventDefault()}>
                        <input className="input" type="number" min={1} defaultValue={2} aria-label="Гости" />
                        <input className="input" type="date" />
                        <input className="input" type="date" />
                        <button className={clsx('btn', 'btn-primary')} type="submit">Найти</button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Hero