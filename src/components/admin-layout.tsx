import { useAuth } from '@/lib/auth'
import cx from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Header from './header'

export default function AdminLayout({
  children,
  mainClassName = '',
  headerTitle = null,
}) {
  const { isAdmin, loading } = useAuth()

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />

      <Layout mainClassName={mainClassName} title={headerTitle}>
        <nav className='flex flex-col gap-2'>
          <SideLink href='/events'>Events</SideLink>
          <SideLink href='/members'>Members</SideLink>
          {!isAdmin ? null : <SideLink href='/admins'>Admins</SideLink>}
        </nav>

        {loading ? loadingDivs : children}
      </Layout>
    </div>
  )
}

const loadingDivs = (
  <div className='flex flex-col gap-4'>
    <div className='h-20 w-full animate-pulse rounded-xl bg-slate-100' />
    <div className='h-20 w-full animate-pulse rounded-xl bg-slate-100' />
    <div className='h-20 w-full animate-pulse rounded-xl bg-slate-100' />
    <div className='h-20 w-full animate-pulse rounded-xl bg-slate-100' />
    <div className='h-20 w-full animate-pulse rounded-xl bg-slate-100' />
  </div>
)

function Layout({ children, mainClassName, title }) {
  return (
    <div className='flex-grow bg-slate-50/80'>
      <div className='flex h-32 items-end border-b bg-white py-8'>
        <h2 className='mx-auto w-full max-w-5xl px-4 text-4xl font-light'>
          {title}
        </h2>
      </div>

      <div className='mx-auto grid max-w-5xl flex-grow grid-cols-1 grid-rows-[auto_1fr] py-8 sm:grid-cols-3 sm:grid-rows-none md:grid-cols-4'>
        <aside className='py-4'>{children[0]}</aside>
        <main className={cx('p-4 sm:col-span-2 md:col-span-3', mainClassName)}>
          {children[1]}
        </main>
      </div>
    </div>
  )
}

function SideLink({
  href,
  as,
  children,
  partiallyActive,
}: {
  href: string
  as?: string
  children: React.ReactNode
  partiallyActive?: boolean
}) {
  const { asPath, isReady } = useRouter()

  const [isLinkActive, setIsLinkActive] = useState(false)

  useEffect(() => {
    if (isReady) {
      // Dynamic route will be matched via props.as
      // Static route will be matched via props.href
      const linkPathname = new URL(as || href, location.href).pathname

      // Using URL().pathname to get rid of query and hash
      const activePathname = new URL(asPath, location.href).pathname

      setIsLinkActive(
        partiallyActive
          ? activePathname.startsWith(linkPathname)
          : activePathname === linkPathname,
      )
    }
  }, [asPath, isReady, as, href, partiallyActive])

  return (
    <Link href={href}>
      <a
        className={cx('rounded px-5 py-2 font-light transition-colors', {
          'text-slate-500 hover:bg-slate-100 hover:font-medium': !isLinkActive,
          'bg-slate-50 font-medium text-slate-900': isLinkActive,
        })}
      >
        {children}
      </a>
    </Link>
  )
}
