import React from 'react'
import clsx from 'clsx'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../auth/AuthProvider'
import s from '../Auth.module.scss'

const Login: React.FC = () => {
  const nav = useNavigate()
  const loc = useLocation()
  const { login } = useAuth()

  const [loginValue, setLoginValue] = React.useState('')
  const [password, setPassword] = React.useState('')
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
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Ошибка входа')
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
              <input className="input" value={loginValue} onChange={(e) => setLoginValue(e.target.value)} />
            </label>

            <label className={s.label}>
              Пароль
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>

            {error && <div className={s.error}>{error}</div>}

            <div className={s.actions}>
              <button className={clsx('btn', 'btn-primary')} type="submit" disabled={loading}>
                {loading ? 'Входим…' : 'Войти'}
              </button>
              <Link className={clsx('btn', 'btn-ghost')} to="/register">
                Регистрация
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