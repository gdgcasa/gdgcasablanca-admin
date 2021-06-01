import useSWR from 'swr'

import AddEditors from '../add-editors'

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

  return (
    <>
      <h1 className='text-3xl font-light'>Admin Dash</h1>

      <AddEditors />

      <section className='py-6'>
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
