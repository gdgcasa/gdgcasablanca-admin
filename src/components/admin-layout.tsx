import cx from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Header from './header'

export default function AdminLayout({ children, headerTitle = null }) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header title={headerTitle} />

      <Layout>
        <nav className='flex flex-col items-start gap-2'>
          <SideLink href='/events'>Events</SideLink>
          <SideLink href='/members'>Members</SideLink>
          <SideLink href='/admins'>Admins</SideLink>
        </nav>
        {children}
      </Layout>
    </div>
  )
}

function Layout({ children }) {
  return (
    <div className='grid flex-grow grid-cols-1 grid-rows-[auto_1fr] sm:grid-cols-3 sm:grid-rows-none md:grid-cols-4'>
      <aside className='border-b-2 border-current p-4 sm:border-b-0 sm:border-r-2'>
        {children[0]}
      </aside>
      <main className='p-4 sm:col-span-2 md:col-span-3'>{children[1]}</main>
    </div>
  )
}

function SideLink({
  href,
  as,
  children,
}: {
  href: string
  as?: string
  children: React.ReactNode
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

      setIsLinkActive(linkPathname === activePathname)
    }
  }, [asPath, isReady, as, href])

  return (
    <Link href={href}>
      <a
        className={cx(
          'rounded px-5 py-2 text-lg font-light transition-colors',
          {
            'hover:bg-blue-50': !isLinkActive,
            'bg-blue-500 text-white': isLinkActive,
          },
        )}
      >
        {children}
      </a>
    </Link>
  )
}
