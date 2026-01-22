import React from 'react'
import clsx from 'clsx'

import s from './header.module.scss'
import { Link } from 'react-router-dom'

const Header: React.FC = () => {
    return (
        <header className={clsx(s['br-header'])}>
            <div className={clsx('br-container', s['br-header-inner'])}>
                <Link to="/" className={clsx(s['br-logo'])}>Baikal Breeze</Link>

                <nav className={clsx(s['br-nav'])}>
                    <Link to="/">Главная</Link>
                    <Link to="/rooms">Номера</Link>
                    <Link to="/about">О нас</Link>
                </nav>

                <div className={clsx(s['br-auth'])}>
                    <button className={clsx('btn', 'btn-ghost')}>Войти</button>
                    <button className={clsx('btn', 'btn-primary')}>Регистрация</button>
                </div>
            </div>
        </header>
    )
}


export default Header
