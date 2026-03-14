import React from 'react'
import clsx from 'clsx'

import AdminSection from '../AdminSection'
import ChangeRoleModal from '../../../../modals/ChangeRoleModal'
import Pagination from '../../../../components/Pagination/Pagination'
import AdminListToolbar from '../AdminToolBar'
import ConfirmModal from '../../../../modals/ConfirmModal/ConfirmModal'

import { useUsersList, useInvalidateUsers } from '../../../../api/queries'
import { userRequests } from '../../../../api'
import { getApiErrorMessage } from '../../../../api/getApiErrorMessage'
import type { UserDTO, ERole } from '../../../../types/userDTOs'
import { roleRu } from '../../../../shared/labels'

import s from '../../admin.module.scss'

const pageSize = 20

const UsersTab: React.FC = () => {
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState('')
  const [roleFilter, setRoleFilter] = React.useState<'Admin' | 'User' | ''>('')

  const { data, isLoading, isFetching, isPlaceholderData, error, refetch } = useUsersList({
    page,
    pageSize,
    search: search.trim() || undefined,
    role: roleFilter || undefined,
    sortBy: 'login',
    sortDir: 'asc',
  })

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const invalidate = useInvalidateUsers()

  const [roleModalOpen, setRoleModalOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<UserDTO | null>(null)

  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const [userToDelete, setUserToDelete] = React.useState<UserDTO | null>(null)

  const load = React.useCallback(async () => {
    invalidate()
    await refetch()
  }, [invalidate, refetch])

  const changeRole = async (userId: string, role: ERole) => {
    try {
      await userRequests.changeRole(userId, { role })
      invalidate()
      await refetch()
    } catch (e) {
      alert(getApiErrorMessage(e))
    }
  }

  const openDelete = (u: UserDTO) => {
    setUserToDelete(u)
    setConfirmOpen(true)
  }

  const doDelete = async () => {
    if (!userToDelete) return
    try {
      setConfirmLoading(true)
      await userRequests.remove(userToDelete.id)
      setConfirmOpen(false)
      setUserToDelete(null)
      invalidate()
      await refetch()
    } catch (e) {
      alert(getApiErrorMessage(e))
    } finally {
      setConfirmLoading(false)
    }
  }

  const confirmText = userToDelete
    ? `${userToDelete.login}\n${userToDelete.email}\n${userToDelete.phoneNumber}\nРоль: ${roleRu(userToDelete.role)}`
    : ''

  return (
    <>
      <AdminSection
        title="Пользователи"
        actions={
          <AdminListToolbar
            filters={
              <select className={clsx('select', s.w180)} value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value as any); setPage(1) }}>
                <option value="">Все роли</option>
                <option value="User">Пользователь</option>
                <option value="Admin">Администратор</option>
              </select>
            }
            search={
              <input className={clsx('input', s.w240)} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Поиск: login/email/phone" />
            }
            actions={
              <>
                <button className={clsx('btn', 'btn-ghost')} onClick={load} disabled={isLoading}>Обновить</button>
                <button className={clsx('btn', 'btn-ghost')} type="button" onClick={() => { setSearch(''); setRoleFilter(''); setPage(1) }}>
                  Сбросить
                </button>
              </>
            }
          />
        }
      >
        {error && <div className={s.error}>{getApiErrorMessage(error)}</div>}
        {(isFetching && isPlaceholderData) && <div className={s.muted} style={{ fontSize: 12 }}>Обновление…</div>}

        {isLoading && !data ? (
          <div className={s.muted}>Загрузка…</div>
        ) : (
          <>
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
                    <button className={clsx('btn', 'btn-ghost')} onClick={() => { setSelectedUser(u); setRoleModalOpen(true) }}>
                      Изменить роль
                    </button>
                    <button className={clsx('btn')} onClick={() => openDelete(u)}>
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
          </>
        )}
      </AdminSection>

      <ConfirmModal
        open={confirmOpen}
        variant="danger"
        title="Удалить пользователя?"
        text={confirmText}
        confirmText="Удалить"
        cancelText="Отмена"
        loading={confirmLoading}
        onClose={() => {
          if (confirmLoading) return
          setConfirmOpen(false)
          setUserToDelete(null)
        }}
        onConfirm={doDelete}
      />

      <ChangeRoleModal
        open={roleModalOpen}
        user={selectedUser}
        onClose={() => { setRoleModalOpen(false); setSelectedUser(null) }}
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