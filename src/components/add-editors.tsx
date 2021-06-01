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
      <div className='flex gap-x-4 mt-2'>
        {selectedUser ? (
          <>
            <div className='h-10 flex items-center'>{selectedUser.name}</div>
            <button
              onClick={handleClick}
              type='button'
              className={`bg-green-50 border border-current rounded px-4 ${
                updatingRole ? 'text-green-400' : 'text-green-700'
              }`}
              disabled={updatingRole}
            >
              Add as editor
            </button>

            <button
              onClick={handleCancel}
              type='button'
              className={`bg-gray-50 border border-current rounded px-4 ${
                updatingRole ? 'text-gray-400' : 'text-gray-700'
              }`}
              disabled={updatingRole}
            >
              Cancel
            </button>
          </>
        ) : (
          <Input
            placeholder='Search for new editors'
            className='max-w-md h-10'
            inputProps={{
              onChange: (e) => setSearchTerm(e.currentTarget.value),
            }}
          />
        )}
      </div>

      <div className='h-5 text-sm'>{!isSearching ? null : 'Searching ...'}</div>

      <div className='flex flex-col gap-y-1 items-start'>
        {users.map((user) => {
          return (
            <button
              type='button'
              key={user.uid}
              className='p-2 bg-gray-100 hover:bg-gray-200 rounded'
              disabled={selectedUser?.uid === user.uid}
              onClick={handleSelectedUser(user)}
            >
              {user.name}
            </button>
          )
        })}
      </div>
    </>
  )
}
