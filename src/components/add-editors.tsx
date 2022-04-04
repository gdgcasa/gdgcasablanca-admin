import * as React from 'react'

import useDebounce from 'src/hooks/debounce'
import { getUsersByEmail } from '@/lib/db'
import Input from './input'

export default function AddEditors() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [users, setUsers] = React.useState<Array<UserType>>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [updatingRole, setUpdatingRole] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<UserType | null>(null)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  React.useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true)
      getUsersByEmail(debouncedSearchTerm).then((results) => {
        setIsSearching(false)
        setUsers(results)
      })
    } else {
      setUsers([])
      setIsSearching(false)
    }
  }, [debouncedSearchTerm])

  async function handleClick() {
    setUpdatingRole(true)

    const newRole: UserType['role'] = 'editor'
    await fetch('/api/members/change-role', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole, uid: selectedUser.uid }),
    })

    setUpdatingRole(false)
    handleCancel()
  }

  function handleCancel() {
    setSelectedUser(null)
    setSearchTerm('')
  }

  function handleSelectedUser(user) {
    return () => {
      setUsers([])
      setSelectedUser(user)
    }
  }

  return (
    <>
      <div className='mt-2 flex gap-x-4'>
        {selectedUser ? (
          <>
            <div className='flex h-10 items-center'>{selectedUser.name}</div>
            <button
              onClick={handleClick}
              type='button'
              className={`rounded border border-current bg-teal-50 px-4 ${
                updatingRole ? 'text-teal-400' : 'text-teal-700'
              }`}
              disabled={updatingRole}
            >
              Add as editor
            </button>

            <button
              onClick={handleCancel}
              type='button'
              className={`rounded border border-current bg-gray-50 px-4 ${
                updatingRole ? 'text-gray-400' : 'text-gray-700'
              }`}
              disabled={updatingRole}
            >
              Cancel
            </button>
          </>
        ) : (
          <Input
            placeholder='Search for new editors by email'
            className='h-10 max-w-md'
            inputProps={{
              onChange: (e) => setSearchTerm(e.currentTarget.value),
            }}
          />
        )}
      </div>

      <div className='h-5 text-sm'>{!isSearching ? null : 'Searching ...'}</div>

      <div className='flex flex-col items-start gap-y-1'>
        {users.map((user) => {
          return (
            <button
              type='button'
              key={user.uid}
              className='flex items-center gap-2 rounded bg-gray-100 px-3 py-2 hover:bg-gray-200'
              disabled={selectedUser?.uid === user.uid}
              onClick={handleSelectedUser(user)}
            >
              <img className='h-6 w-6 rounded-full' src={user.photoUrl} />
              {user.name}
            </button>
          )
        })}
      </div>
    </>
  )
}
