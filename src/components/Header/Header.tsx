import React from 'react'
import clsx from 'clsx'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../theme/ThemeProvidet'
import s from './header.module.scss'
import { useAuth } from '../../auth/AuthProvider'
import { ERole } from '../../types/userDTOs'
import { Disclosure } from '@headlessui/react'
import logoSmall from '../../../public/logo_small.png'

const Header: React.FC = () => {
  const { isAuth, user, role, logout } = useAuth()
  const isAdmin = role === ERole.Admin
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Главная' },
    { path: '/rooms', label: 'Номера' },
    { path: '/about', label: 'О нас' },
    ...(isAuth ? [{ path: '/profile', label: 'Личный кабинет' }] : []),
    ...(isAdmin ? [{ path: '/admin', label: 'Админ панель' }] : []),
  ]

  return (
    <header className={clsx(s['br-header'])}>
      <div className={clsx('br-container', s['br-header-inner'])}>
        <Link to="/" className={clsx(s['br-logo'])}>
          <img
            src={logoSmall}
            alt=""
            className={s['br-logo-img']}
            width={40}
            height={40}
            draggable={false}
          />
          <span className={s['br-logo-text']}>
            Baikal
            <span className={s['br-logo-accent']}>Breeze</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={clsx(s['br-nav'])}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={clsx(s['br-nav-link'], { [s['br-nav-link-active']]: isActive(link.path) })}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Theme & Auth */}
        <div className={clsx(s['br-right-controls'])}>
          <button
            type="button"
            className={clsx(s['br-theme-toggle'])}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Светлая тема' : 'Темная тема'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {isAuth ? (
            <div className={clsx(s['br-user-menu'])}>
              <span className={s['br-user-name']}>{user?.login}</span>
              <button
                type="button"
                className={clsx('btn', 'btn-primary')}
                onClick={logout}
              >
                Выйти
              </button>
            </div>
          ) : (
            <div className={clsx(s['br-auth-buttons'])}>
              <Link to="/login">
                <button className={clsx('btn', 'btn-ghost')}>
                  Логин
                </button>
              </Link>
              <Link to="/register">
                <button className={clsx('btn', 'btn-primary')}>
                  Регистрация
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu with Headless UI */}
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={clsx(s['br-burger'], { [s['br-burger-open']]: open })}
                aria-label="Toggle menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </Disclosure.Button>

              <Disclosure.Panel className={clsx(s['br-mobile-menu'])}>
                <nav className={clsx(s['br-mobile-nav'])}>
                  {navLinks.map(link => (
                    <Disclosure.Button
                      as={Link}
                      key={link.path}
                      to={link.path}
                      className={clsx(s['br-mobile-nav-link'], { [s['br-mobile-nav-link-active']]: isActive(link.path) })}
                    >
                      {link.label}
                    </Disclosure.Button>
                  ))}
                </nav>

                <div className={clsx(s['br-mobile-controls'])}>
                  <button
                    type="button"
                    className={clsx(s['br-mobile-theme-toggle'])}
                    onClick={toggleTheme}
                  >
                    {theme === 'dark' ? '☀️ Светлая' : '🌙 Темная'}
                  </button>

                  {isAuth ? (
                    <button
                      type="button"
                      className={clsx('btn', 'btn-primary')}
                      onClick={logout}
                    >
                      Выйти
                    </button>
                  ) : (
                    <>
                      <Link to="/login">
                        <button className={clsx('btn', 'btn-ghost')}>
                          Логин
                        </button>
                      </Link>
                      <Link to="/register">
                        <button className={clsx('btn', 'btn-primary')}>
                          Регистрация
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </header>
  )
}

export default Header