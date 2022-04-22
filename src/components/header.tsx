import { useAuth } from '@/lib/auth'
import Link from 'next/link'

export default function Header() {
  return (
    <header className='sticky top-0 z-50 border-b bg-white'>
      <div className='mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-3 md:grid-cols-4'>
        <Link href='/'>
          <a className='px-4 py-3 font-bold'>GDG Casa - Admin</a>
        </Link>
        <div className='flex items-center px-4 py-2 sm:col-span-2 sm:justify-end md:col-span-3'>
          <nav className='flex items-center gap-2'>
            <UserAuth />
          </nav>
        </div>
      </div>
    </header>
  )
}

function UserAuth() {
  const { user, signout, loading } = useAuth()

  if (loading) {
    return (
      <div className='h-3.5 w-28 animate-pulse rounded-full bg-slate-200'></div>
    )
  }

  if (!user) {
    return (
      <Link href='/login'>
        <a>Login</a>
      </Link>
    )
  }

  return (
    <button type='button' onClick={() => signout('/login')}>
      Logout
      {user?.role ? (
        <span className='font-bold capitalize'> ({user?.role})</span>
      ) : null}
    </button>
  )
}
