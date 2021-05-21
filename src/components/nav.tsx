import Link from 'next/link'

import { useAuth } from '@/lib/auth'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Members', href: '/members' },
  { label: 'Add a member', href: '/members/add' },
]

export default function Nav() {
  const { user, signout } = useAuth()

  return (
    <nav className='flex gap-x-2 items-center'>
      {links.map(({ href, label }) => (
        <Link href={href} key={href}>
          <a className='text-green-600 border-b-2 border-transparent hover:text-green-800 hover:border-current font-bold transition-colors'>
            {label}
          </a>
        </Link>
      ))}

      <div className='ml-auto'>
        {!user ? (
          <Link href='/login'>
            <a className='text-green-600 border-b-2 border-transparent hover:text-green-800 hover:border-current font-bold transition-colors'>
              Login
            </a>
          </Link>
        ) : (
          <button
            type='button'
            onClick={() => signout()}
            className='text-green-600 border-b-2 border-transparent hover:text-green-800 hover:border-current font-bold transition-colors'
          >
            Log out
          </button>
        )}
      </div>
    </nav>
  )
}
