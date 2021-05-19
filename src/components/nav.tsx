import Link from 'next/link'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Members', href: '/members' },
  { label: 'Add a member', href: '/members/add' },
]

export default function Nav() {
  return (
    <nav className='flex gap-x-2'>
      {links.map(({ href, label }) => (
        <Link href={href} key={href}>
          <a className='text-green-600 border-b-2 border-transparent hover:text-green-800 hover:border-current font-bold transition-colors'>
            {label}
          </a>
        </Link>
      ))}
    </nav>
  )
}
