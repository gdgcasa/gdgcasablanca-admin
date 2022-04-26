import cx from 'classnames'
import useSWR, { useSWRConfig } from 'swr'

import { useAuth } from '@/lib/auth'
import AdminLayout from '../admin-layout'

export default function AdminsScreen() {
  const { data, error } = useSWR<Array<UserType>>('/api/users')

  if (error) {
    return (
      <AdminLayout headerTitle='Admins'>
        <div>There is an error</div>
      </AdminLayout>
    )
  }
  if (!data) {
    return (
      <AdminLayout headerTitle='Admins'>
        <div>Loading ...</div>
      </AdminLayout>
    )
  }

  const admins = data.filter((user) => user.role === 'admin')
  const editors = data.filter((user) => user.role === 'editor')
  const nonEditors = data.filter((user) => user.role === 'user')

  return (
    <AdminLayout headerTitle='Admins'>
      <div className='flex flex-col gap-6'>
        <section>
          <h2 className='mb-3 text-xl'>Admins</h2>
          <UserList actions={['editor', 'user']} users={admins} />
        </section>
        <section>
          <h2 className='mb-3 text-xl'>Editors</h2>
          <UserList actions={['admin', 'user']} users={editors} />
        </section>
        <section>
          <h2 className='mb-3 text-xl'>Non Editors</h2>
          <UserList actions={['editor', 'admin']} users={nonEditors} />
        </section>
      </div>
    </AdminLayout>
  )
}

function UserList({
  users,
  actions,
}: {
  users: Array<UserType>
  actions: Array<UserType['role']>
}) {
  const { user: currentUser } = useAuth()
  const { mutate } = useSWRConfig()

  async function changeRole(selectedUser: UserType, role: UserType['role']) {
    await fetch('/api/members/change-role', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, uid: selectedUser.uid }),
    })
    mutate('/api/users')
  }

  return (
    <ul className='divide-y-2'>
      {users?.map((user) => {
        const isMeText = isMe({ curr: user, user: currentUser })

        return (
          <li
            key={user.uid}
            className='flex flex-wrap items-baseline gap-x-2 gap-y-4 p-2 hover:bg-slate-100'
          >
            <span>{user.name}</span>
            {!isMeText ? null : (
              <span className='flex items-center justify-center rounded bg-blue-600 px-1 py-0.5 text-xs text-white'>
                {isMeText}
              </span>
            )}
            <div className='flex gap-2 md:ml-auto'>
              {actions.map((action) => {
                return (
                  <button
                    className={cx(
                      'rounded border border-current px-2 py-0.5 transition-colors',
                      actionsStyles[action],
                    )}
                    onClick={() => changeRole(user, action)}
                  >
                    {actionsMap[action]}
                  </button>
                )
              })}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

const actionsMap = {
  admin: 'Make Admin',
  editor: 'Make Editor',
  user: 'Remove Access',
}

const actionsStyles = {
  admin: 'text-teal-600 hover:text-white hover:bg-teal-600',
  editor: 'text-blue-600 hover:text-white hover:bg-blue-600',
  user: 'text-red-600 hover:text-white hover:bg-red-600',
}

function isMe({ curr, user }: { curr: UserType; user: UserType }) {
  return curr.uid === user?.uid ? 'Me' : null
}
