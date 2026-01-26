import React from 'react'
import s from '../../pages/Admin/admin.module.scss'

type Props = {
  title: string
  actions?: React.ReactNode
  children: React.ReactNode
}

const AdminSection: React.FC<Props> = ({ title, actions, children }) => {
  return (
    <section className={s.section}>
      <div className={s.sectionHead}>
        <h2 className={s.h2}>{title}</h2>
        <div className={s.sectionActions}>{actions}</div>
      </div>
      {children}
    </section>
  )
}

export default AdminSection