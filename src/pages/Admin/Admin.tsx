import React from 'react'
import clsx from 'clsx'

import AdminTabs from '../../components/Admin/AdminTabs';
import RoomTypesTab from '../../components/Admin/AdminTabs/RoomTypesTab';
import RoomsTab from '../../components/Admin/AdminTabs/RoomsTab';
import BookingsTab from '../../components/Admin/AdminTabs/BookingTab';
import UsersTab from '../../components/Admin/AdminTabs/UserTab';

import s from './admin.module.scss'

export type AdminTabKey = 'roomTypes' | 'rooms' | 'bookings' | 'users'

const AdminPanel: React.FC = () => {
  const [tab, setTab] = React.useState<AdminTabKey>('roomTypes')

  return (
    <main className={s.page}>
      <div className={clsx('br-container', s.head)}>
        <h1 className={s.h1}>Админ-панель</h1>
        <AdminTabs value={tab} onChange={setTab} />
      </div>

      <div className={clsx('br-container', s.body)}>
        {tab === 'roomTypes' && <RoomTypesTab />}
        {tab === 'rooms' && <RoomsTab />}
        {tab === 'bookings' && <BookingsTab />}
        {tab === 'users' && <UsersTab />}
      </div>
    </main>
  )
}

export default AdminPanel