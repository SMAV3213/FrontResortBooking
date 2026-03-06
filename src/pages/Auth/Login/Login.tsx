import React from 'react'
import clsx from 'clsx'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../auth/AuthProvider'
import s from '../Auth.module.scss'
import { getApiErrorMessage } from '../../../api/getApiErrorMessage'

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const Login: React.FC = () => {
  const nav = useNavigate()
  const loc = useLocation()
  const { login } = useAuth()

  const [loginValue, setLoginValue] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const from = (loc.state as any)?.from ?? '/'

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!loginValue.trim() || !password) {
      setError('Заполните логин и пароль')
      return
    }

    try {
      setLoading(true)
      await login({ login: loginValue.trim(), password })
      nav(from, { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={s.page}>
      <div className={clsx('br-container', s.wrap)}>
        <div className={s.card}>
          <h1 className={s.h1}>Вход</h1>
          <p className={s.sub}>Войдите в аккаунт, чтобы управлять бронированиями.</p>

          <form className={s.form} onSubmit={onSubmit}>
            <label className={s.label}>
              Логин
              <input
                className="input"
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
              />
            </label>

            <label className={s.label}>
              Пароль
              <div className={s.passwordWrap}>
                <input
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={s.eyeBtn}
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </label>

            {error && <div className={s.error}>{error}</div>}

            <div className={s.actions}>
              <button
                className={clsx('btn', 'btn-primary')}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Входим…' : 'Войти'}
              </button>
              <Link to="/register">
                <button className={clsx('btn', 'btn-ghost')}>Регистрация</button>
              </Link>
            </div>

            <div className={s.links}>
              <span />
              <Link to="/">На главную</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Login