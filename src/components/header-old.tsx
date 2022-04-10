import Nav from './nav'

export default function HeaderOld() {
  return (
    <header className='mx-auto flex flex-col gap-y-3 p-4 md:max-w-4xl md:p-8 '>
      <h1 className='font-bold text-gray-600'>Welcome to GDG Casa admin!</h1>

      <Nav />
    </header>
  )
}
