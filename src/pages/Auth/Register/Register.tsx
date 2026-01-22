import React from 'react'
import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../auth/AuthProvider'
import s from '../Auth.module.scss'

const Register: React.FC = () => {
  const nav = useNavigate()
  const { register } = useAuth()

  const [loginValue, setLoginValue] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phoneNumber, setPhoneNumber] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [password2, setPassword2] = React.useState('')

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!loginValue.trim() || !email.trim() || !phoneNumber.trim() || !password) {
      setError('Заполните логин, email, телефон и пароль')
      return
    }
    if (password.length < 6) {
      setError('Пароль должен быть минимум 6 символов')
      return
    }
    if (password !== password2) {
      setError('Пароли не совпадают')
      return
    }

    try {
      setLoading(true)
      await register({
        login: loginValue.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password,
      })
      nav('/', { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={s.page}>
      <div className={clsx('br-container', s.wrap)}>
        <div className={s.card}>
          <h1 className={s.h1}>Регистрация</h1>
          <p className={s.sub}>Создайте аккаунт, чтобы бронировать номера.</p>

          <form className={s.form} onSubmit={onSubmit}>
            <label className={s.label}>
              Логин
              <input className="input" value={loginValue} onChange={(e) => setLoginValue(e.target.value)} />
            </label>

            <label className={s.label}>
              Email
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>

            <label className={s.label}>
              Телефон
              <input className="input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+7..." />
            </label>

            <label className={s.label}>
              Пароль
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>

            <label className={s.label}>
              Повтор пароля
              <input className="input" type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
            </label>

            {error && <div className={s.error}>{error}</div>}

            <div className={s.actions}>
              <button className={clsx('btn', 'btn-primary')} type="submit" disabled={loading}>
                {loading ? 'Создаём…' : 'Создать аккаунт'}
              </button>
              <Link className={clsx('btn', 'btn-ghost')} to="/login">
                Уже есть аккаунт
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

export default Register