import Link from 'next/link'

import { useAuth } from '@/lib/auth'

export default function Nav() {
  const { user, signout } = useAuth()

  const isAdmin = user?.role === 'admin'
  const canEdit = user?.role === 'admin' || user?.role === 'editor'

  return (
    <nav className='flex items-center gap-x-2'>
      <Link href='/members'>
        <a className='border-b-2 border-transparent text-teal-600 transition-colors hover:border-current hover:text-teal-800'>
          Members
        </a>
      </Link>

      {!canEdit ? null : (
        <Link href='/members/add'>
          <a className='border-b-2 border-transparent text-teal-600 transition-colors hover:border-current hover:text-teal-800'>
            Add a member
          </a>
        </Link>
      )}

      <div className='ml-auto'>
        {!user ? (
          <Link href='/login'>
            <a className='border-b-2 border-transparent text-teal-600 transition-colors hover:border-current hover:text-teal-800'>
              Login
            </a>
          </Link>
        ) : (
          <button
            type='button'
            onClick={() => signout('/')}
            className='border-b-2 border-transparent text-teal-600 transition-colors hover:border-current hover:text-teal-800'
          >
            Logout
            {user?.role ? (
              <span className='font-bold capitalize'> ({user?.role})</span>
            ) : null}
          </button>
        )}
      </div>
    </nav>
  )
}
