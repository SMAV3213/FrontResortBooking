import React from 'react'
import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
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

const digitsOnly = (v: string) => v.replace(/\D/g, '')

const formatPhone = (digits: string): string => {
  const d = digits.slice(0, 10)

  if (d.length === 0) return '+7'
  if (d.length <= 3) return `+7 (${d}`
  if (d.length <= 6) return `+7 (${d.slice(0, 3)}) ${d.slice(3)}`
  if (d.length <= 8) return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
  return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8, 10)}`
}

const unmaskPhone = (masked: string): string => {
  const d = digitsOnly(masked)
  return d.length > 0 ? `+${d}` : ''
}

const blockPaste = (e: React.ClipboardEvent) => e.preventDefault()

const Register: React.FC = () => {
  const nav = useNavigate()
  const { register } = useAuth()

  const [loginValue, setLoginValue] = React.useState('')
  const [email, setEmail] = React.useState('')
  // Храним только «чистые» 10 цифр номера (без 7)
  const [phoneDigits, setPhoneDigits] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [password2, setPassword2] = React.useState('')

  const [showPassword, setShowPassword] = React.useState(false)
  const [showPassword2, setShowPassword2] = React.useState(false)

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const phoneRef = React.useRef<HTMLInputElement>(null)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Берём все цифры из того, что ввёл пользователь
    let raw = digitsOnly(e.target.value)

    if (raw.startsWith('7') || raw.startsWith('8')) {
      raw = raw.slice(1)
    }

    raw = raw.slice(0, 10)
    setPhoneDigits(raw)
  }

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = phoneRef.current
    if (!input) return

    if (e.key === 'Backspace') {
      e.preventDefault()
      setPhoneDigits((prev) => prev.slice(0, -1))
      return
    }

    if (e.key === 'Delete') {
      e.preventDefault()
      setPhoneDigits((prev) => prev.slice(0, -1))
      return
    }
  }

  const handlePhoneFocus = () => {
    requestAnimationFrame(() => {
      const input = phoneRef.current
      if (input) {
        const len = input.value.length
        input.setSelectionRange(len, len)
      }
    })
  }

  const handlePhoneClick = () => handlePhoneFocus()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const rawPhone = `+7${phoneDigits}`

    if (!loginValue.trim() || !email.trim() || phoneDigits.length < 10 || !password) {
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
        phoneNumber: rawPhone,
        password,
      })
      nav('/', { replace: true })
    } catch (err: any) {
      setError(getApiErrorMessage(err))
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
              <input
                className="input"
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
              />
            </label>

            <label className={s.label}>
              Email
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className={s.label}>
              Телефон
              <input
                ref={phoneRef}
                className="input"
                type="tel"
                value={formatPhone(phoneDigits)}
                onChange={handlePhoneChange}
                onKeyDown={handlePhoneKeyDown}
                onFocus={handlePhoneFocus}
                onClick={handlePhoneClick}
                onPaste={blockPaste}
                placeholder="+7 (___) ___-__-__"
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
                  onPaste={blockPaste}
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

            <label className={s.label}>
              Повтор пароля
              <div className={s.passwordWrap}>
                <input
                  className="input"
                  type={showPassword2 ? 'text' : 'password'}
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  onPaste={blockPaste}
                />
                <button
                  type="button"
                  className={s.eyeBtn}
                  tabIndex={-1}
                  onClick={() => setShowPassword2((v) => !v)}
                  aria-label={showPassword2 ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {showPassword2 ? <EyeOffIcon /> : <EyeIcon />}
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
                {loading ? 'Создаём…' : 'Создать аккаунт'}
              </button>
              <Link to="/login">
                <button className={clsx('btn', 'btn-ghost')}>Уже есть аккаунт</button>
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