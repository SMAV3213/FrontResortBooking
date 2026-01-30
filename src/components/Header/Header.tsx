import React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useTheme } from '../../theme/ThemeProvidet'
import s from './header.module.scss'
import { useAuth } from '../../auth/AuthProvider'
import { ERole } from '../../types/userDTOs'

const Header: React.FC = () => {
  const { isAuth, user, role, logout } = useAuth()
  const isAdmin = role === ERole.Admin
  const { theme, toggleTheme } = useTheme()

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
        <button type="button" className={clsx('btn', 'btn-ghost')} onClick={toggleTheme}>
          {theme === 'dark' ? 'Светлая' : 'Тёмная'}
        </button>

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
              <Link to="/login" >
                <button className={clsx('btn', 'btn-ghost')}>
                  Логин
                </button>
              </Link>
              <Link to="/register" >
                <button className={clsx('btn', 'btn-primary')}>
                  Регистрация
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header