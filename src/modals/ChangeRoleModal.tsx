import React from 'react'
import clsx from 'clsx'
import type { UserDTO, ERole } from '../types/userDTOs'
import s from '../pages/Admin/admin.module.scss'
import { roleRu } from '../shared/labels';

type Props = {
  open: boolean
  user: UserDTO | null
  onClose: () => void
  onSave: (role: ERole) => void | Promise<void>
}

const ROLE_OPTIONS: { value: ERole; label: string }[] = [
  { value: 0 as ERole, label: 'Пользователь' },
  { value: 1 as ERole, label: 'Администратор' },
]

const ChangeRoleModal: React.FC<Props> = ({ open, user, onClose, onSave }) => {
  const [role, setRole] = React.useState<ERole>(0 as ERole)

  React.useEffect(() => {
    if (!open || !user) return
    setRole(user.role)
  }, [open, user])

  if (!open || !user) return null

  return (
    <div className={s.modalOverlay} onClick={onClose} role="presentation">
      <div className={s.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={s.modalHead}>
          <div className={s.modalTitle}>Изменить роль</div>
          <button className={clsx('btn', 'btn-ghost')} onClick={onClose}>
            Закрыть
          </button>
        </div>

        <div className={s.form}>
          <div className={s.muted}>
            Пользователь: <b>{user.login}</b> • Текущая роль: <b>{roleRu(user.role)}</b>
          </div>

          <label className={s.label}>
            Новая роль
            <select className="select" value={String(role)} onChange={(e) => setRole(Number(e.target.value) as ERole)}>
              {ROLE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <div className={s.modalActions}>
            <button className={clsx('btn', 'btn-primary')} onClick={() => onSave(role)}>
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangeRoleModal