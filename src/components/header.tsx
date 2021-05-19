import Nav from './nav'

export default function Header() {
  return (
    <header className='flex flex-col gap-y-3 p-4 md:p-8 md:max-w-4xl mx-auto '>
      <h1 className='text-gray-600 font-bold'>Welcome to GDG Casa admin!</h1>

      <Nav />
    </header>
  )
}
