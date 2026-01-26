import React from 'react'
import clsx from 'clsx'

import AdminSection from '../AdminSection'
import ChangeRoleModal from '../../../modals/ChangeRoleModal'

import { userRequests } from '../../../api'
import { getApiErrorMessage } from '../../../api/getApiErrorMessage'
import type { UserDTO } from '../../../types/userDTOs'
import { ERole } from '../../../types/userDTOs'
import { roleRu } from '../../../shared/labels'

import s from "../../../pages/Admin/admin.module.scss"

const UsersTab: React.FC = () => {
  const [items, setItems] = React.useState<UserDTO[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [roleModalOpen, setRoleModalOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<UserDTO | null>(null)

  const load = React.useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await userRequests.getAll()
      setItems(data)
    } catch (e) {
      setItems([])
      setError(getApiErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    load()
  }, [load])

  const remove = async (id: string) => {
    if (!window.confirm('Удалить пользователя?')) return
    try {
      await userRequests.remove(id)
      await load()
    } catch (e) {
      alert(getApiErrorMessage(e))
    }
  }

  const changeRole = async (userId: string, role: ERole) => {
    try {
      await userRequests.changeRole(userId, { role })
      await load()
    } catch (e) {
      alert(getApiErrorMessage(e))
    }
  }

  return (
    <>
      <AdminSection
        title="Пользователи"
        actions={
          <button className={clsx('btn', 'btn-ghost')} onClick={load} disabled={loading}>
            Обновить
          </button>
        }
      >
        {error && <div className={s.error}>{error}</div>}

        {loading ? (
          <div className={s.muted}>Загрузка…</div>
        ) : (
          <div className={s.list}>
            {items.map((u) => (
              <div key={u.id} className={s.rowCard}>
                <div className={s.rowMain}>
                  <div className={s.rowTitle}>{u.login}</div>
                  <div className={s.rowSub}>
                    {u.email} • {u.phoneNumber} • роль: {roleRu(u.role)}
                  </div>
                </div>

                <div className={s.rowActions}>
                  <button
                    className={clsx('btn', 'btn-ghost')}
                    onClick={() => {
                      setSelectedUser(u)
                      setRoleModalOpen(true)
                    }}
                  >
                    Изменить роль
                  </button>

                  <button className={clsx('btn')} onClick={() => remove(u.id)}>
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminSection>

      <ChangeRoleModal
        open={roleModalOpen}
        user={selectedUser}
        onClose={() => {
          setRoleModalOpen(false)
          setSelectedUser(null)
        }}
        onSave={async (newRole) => {
          if (!selectedUser) return
          await changeRole(selectedUser.id, newRole)
          setRoleModalOpen(false)
          setSelectedUser(null)
        }}
      />
    </>
  )
}

export default UsersTab