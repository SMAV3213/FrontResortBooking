import React from 'react'
import clsx from 'clsx'
import type { AdminTabKey } from '../Admin'
import s from '../admin.module.scss'


type Props = {
  value: AdminTabKey
  onChange: (tab: AdminTabKey) => void
}

const AdminTabs: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className={s.tabs}>
      <button className={clsx('btn', value === 'roomTypes' ? 'btn-primary' : 'btn-ghost')} onClick={() => onChange('roomTypes')}>
        Типы номеров
      </button>
      <button className={clsx('btn', value === 'rooms' ? 'btn-primary' : 'btn-ghost')} onClick={() => onChange('rooms')}>
        Комнаты
      </button>
      <button className={clsx('btn', value === 'bookings' ? 'btn-primary' : 'btn-ghost')} onClick={() => onChange('bookings')}>
        Брони
      </button>
      <button className={clsx('btn', value === 'users' ? 'btn-primary' : 'btn-ghost')} onClick={() => onChange('users')}>
        Пользователи
      </button>
    </div>
  )
}

export default AdminTabs