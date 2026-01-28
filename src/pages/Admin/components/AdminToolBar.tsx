import React from 'react'
import clsx from 'clsx'
import s from '../admin.module.scss'

type Props = {
  filters?: React.ReactNode
  sort?: React.ReactNode
  actions?: React.ReactNode
  search?: React.ReactNode
  className?: string
}

const AdminListToolbar: React.FC<Props> = ({ filters, sort, actions, search, className }) => {
  return (
    <div className={clsx(s.toolbar, className)}>
      {filters ? (
        <div className={s.toolbarPanel}>
          <div className={s.toolbarTitle}>Фильтры</div>
          <div className={s.toolbarContent}>{filters}</div>
        </div>
      ) : null}

      {sort ? (
        <div className={s.toolbarPanel}>
          <div className={s.toolbarTitle}>Сортировка</div>
          <div className={s.toolbarContent}>{sort}</div>
        </div>
      ) : null}

      {search ? (
        <div className={clsx(s.toolbarPanel, s.toolbarActions)}>
          <div className={s.toolbarTitle}>Поиск</div>
          <div className={s.toolbarContent}>{search}</div>
        </div>
      ) : null}

      {actions ? (
        <div className={clsx(s.toolbarPanel, s.toolbarActions)}>
          <div className={s.toolbarTitle}>Действия</div>
          <div className={s.toolbarContent}>{actions}</div>
        </div>
      ) : null}

    </div>
  )
}

export default AdminListToolbar