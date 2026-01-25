import React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

import s from './header.module.scss'
import { useAuth } from '../../auth/AuthProvider' 
import { ERole } from '../../types/userDTOs'      

const Header: React.FC = () => {
  const { isAuth, user, role, logout } = useAuth()
  const isAdmin = role === ERole.Admin

  return (
    <header className={clsx(s['br-header'])}>
      <div className={clsx('br-container', s['br-header-inner'])}>
        <Link to="/" className={clsx(s['br-logo'])}>
          Baikal Breeze
        </Link>

        <nav className={clsx(s['br-nav'])}>
          <Link to="/">Главная</Link>
          <Link to="/rooms">Номера</Link>
          <Link to="/about">О нас</Link>
          {isAuth && <Link to="/profile">Личный кабинет</Link>}
          {isAdmin && <Link to="/admin">Админ панель</Link>}
        </nav>

        <div className={clsx(s['br-auth'])}>
          {isAuth ? (
            <>
              <span className={s['br-user']}>{user?.login}</span>

              <button type="button" className={clsx('btn', 'btn-primary')} onClick={logout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={clsx('btn', 'btn-ghost')}>
                Логин
              </Link>
              <Link to="/register" className={clsx('btn', 'btn-primary')}>
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header