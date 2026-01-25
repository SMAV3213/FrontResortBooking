import React from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { useLocation, useNavigate } from 'react-router-dom'
import s from './authRequiredModal.module.scss'

type Props = {
  open: boolean
  onClose: () => void
}

const AuthRequiredModal: React.FC<Props> = ({ open, onClose }) => {
  const nav = useNavigate()
  const loc = useLocation()

  React.useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null
  if (typeof document === 'undefined') return null

  const goLogin = () => nav('/login', { state: { from: loc.pathname }, replace: true })
  const goRegister = () => nav('/register', { state: { from: loc.pathname }, replace: true })

  return createPortal(
    <div className={s.overlay} onClick={onClose} role="presentation">
      <div className={s.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={s.title}>Нужна авторизация</div>
        <div className={s.text}>Чтобы забронировать номер, войдите или зарегистрируйтесь.</div>

        <div className={s.actions}>
          <button type="button" className={clsx('btn', 'btn-primary')} onClick={goLogin}>
            Войти
          </button>
          <button type="button" className={clsx('btn', 'btn-ghost')} onClick={goRegister}>
            Регистрация
          </button>
          <button type="button" className={clsx('btn')} onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default AuthRequiredModal