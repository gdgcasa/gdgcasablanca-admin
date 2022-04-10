import { useAuth } from '@/lib/auth'
import Link from 'next/link'

export default function Header({ title = 'Home' }) {
  return (
    <header className='sticky top-0 z-50 grid grid-cols-1 border-b-2 border-current bg-white sm:grid-cols-3 md:grid-cols-4'>
      <Link href='/v2'>
        <a className='flex items-center justify-center border-b-2 border-current px-4 py-3 font-bold sm:border-b-0 sm:border-r-2'>
          GDG Casa - Admin
        </a>
      </Link>
      <div className='flex items-center justify-between px-4 py-2 sm:col-span-2 md:col-span-3'>
        <div>{title}</div>
        <nav className='flex items-center gap-2'>
          <UserAuth />
        </nav>
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
