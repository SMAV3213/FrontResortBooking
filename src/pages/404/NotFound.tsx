import React from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import s from './NotFound.module.scss'

const NotFound: React.FC = () => {
  const nav = useNavigate()

  return (
    <div className={s.wrapper}>
      <div className={s.overlay}>
        <div className={s.content}>
          <span className={s.code}>404</span>

          <div className={s.divider} />

          <h1 className={s.title}>Страница не найдена</h1>

          <p className={s.text}>
            Возможно, она была удалена или вы ошиблись в адресе.
          </p>

          <div className={s.actions}>
            <button
              className={clsx("btn", "btn-primary")}
              onClick={() => nav('/')}
            >
              На главную
            </button>

            <button
              className={clsx("btn", "btn-ghost")}
              onClick={() => nav(-1)}
            >
              Назад
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound