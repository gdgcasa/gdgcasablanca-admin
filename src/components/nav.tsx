import Link from 'next/link'

import { useAuth } from '@/lib/auth'

export default function Nav() {
  const { user, signout } = useAuth()

  const isAdmin = user?.role === 'admin'
  const canEdit = user?.role === 'admin' || user?.role === 'editor'

  return (
    <nav className='flex gap-x-2 items-center'>
      <Link href='/members'>
        <a className='text-green-600 border-b-2 border-transparent hover:text-green-800 hover:border-current transition-colors'>
          Members
        </a>
      </Link>

      {!canEdit ? null : (
        <Link href='/members/add'>
          <a className='text-green-600 border-b-2 border-transparent hover:text-green-800 hover:border-current transition-colors'>
            Add a member
          </a>
        </Link>
      )}

      {!isAdmin ? null : (
        <Link href='/admin'>
          <a className='text-green-600 border-b-2 border-transparent hover:text-green-800 hover:border-current transition-colors'>
            Admin Dash
          </a>
        </Link>
      )}

      <div className='ml-auto'>
        {!user ? (
          <Link href='/login'>
            <a className='text-green-600 border-b-2 border-transparent hover:text-green-800 hover:border-current transition-colors'>
              Login
            </a>
          </Link>
        ) : (
          <button
            type='button'
            onClick={() => signout('/')}
            className='text-green-600 border-b-2 border-transparent hover:text-green-800 hover:border-current transition-colors'
          >
            Log out
            {user?.role ? (
              <span className='font-bold capitalize'> ({user?.role})</span>
            ) : null}
          </button>
        )}
      </div>
    </nav>
  )
}
