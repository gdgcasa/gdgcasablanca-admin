import Link from 'next/link'
import useSWR from 'swr'
import Input from '../input'

export default function AdminDash() {
  const { data, error } = useSWR<Array<UserType>>('/api/users')

  if (error) {
    return <div>There is an error</div>
  }
  if (!data) {
    return <div>Loading ...</div>
  }

  const admins = data.filter((user) => user.role === 'admin')
  const editors = data.filter((user) => user.role === 'editor')

  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <>
      <h1 className='text-3xl font-light'>Admin Dash</h1>

      <form onSubmit={handleSubmit} className='flex gap-x-4'>
        <div className='max-w-xl'>
          <Input placeholder='Search for new editors' />
        </div>
        <button
          type='submit'
          className='bg-green-50 text-green-700 border border-current rounded px-4'
        >
          Add an editor
        </button>
      </form>
      <section className='py-4'>
        <h2>Admins</h2>
        <ul className='list-disc ml-6'>
          {admins.map((admin) => {
            return <li key={admin.uid}>{admin.name}</li>
          })}
        </ul>
      </section>
      <section className='py-4'>
        <h2>Editor</h2>
        <ul className='list-disc ml-6'>
          {editors.map((editor) => {
            return <li key={editor.uid}>{editor.name}</li>
          })}
        </ul>
      </section>
    </>
  )
}
