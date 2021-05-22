import Link from 'next/link'

import { useAuth } from '@/lib/auth'

const links = [
  { label: 'Members', href: '/members' },
  { label: 'Add a member', href: '/members/add' },
]

export default function Nav() {
  const { user, signout } = useAuth()

  const isAdmin = user?.role === 'admin'

  return (
    <nav className='flex gap-x-2 items-center'>
      {links.map(({ href, label }) => (
        <Link href={href} key={href}>
          <a className='text-green-600 border-b-2 border-transparent hover:text-green-800 hover:border-current transition-colors'>
            {label}
          </a>
        </Link>
      ))}
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
