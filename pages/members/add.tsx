import Head from 'next/head'
import * as React from 'react'

import Input from '@/components/input'

export default function Home() {
  const [formDataState, setFormDataState] = React.useState<
    Record<string, string | Blob>
  >({})
  const [loading, setLoading] = React.useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData()

    Object.entries(formDataState).forEach(([key, value]) => {
      formData.append(key, value)
    })

    fetch('/api/members/add', { method: 'POST', body: formData }).finally(() =>
      setLoading(false),
    )

    setFormDataState({})
  }

  function handleChangle(event: React.FormEvent<HTMLInputElement>) {
    const name = event.currentTarget.name

    let value: string | Blob = event.currentTarget.value
    if (event.currentTarget.type === 'file') {
      value = event.currentTarget.files[0]
    }

    setFormDataState((prevData) => ({ ...prevData, [name]: value }))
  }

  return (
    <div>
      <Head>
        <title>Add a member - GDG Casablanca Admin</title>
        <meta name='description' content='Admin - GDG Casablanca' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <h1 className='p-4 md:p-8 md:max-w-4xl mx-auto text-gray-600 font-bold'>
          Welcome to <a href='https://gdgcasablanca.com'>GDG Casa admin!</a>
        </h1>

        <section className='p-4 md:p-8 md:max-w-4xl mx-auto'>
          <h2 className=' mb-4 md:mb-6 text-2xl md:text-4xl font-light'>
            Add a member
          </h2>

          <form onSubmit={handleSubmit}>
            <div className='flex flex-col gap-y-4 items-start max-w-sm'>
              <Input
                id='firstname'
                name='firstname'
                label='First name:'
                placeholder='First name:'
                inputProps={{ onChange: handleChangle, required: true }}
              />

              <Input
                id='lastname'
                name='lastname'
                label='Last name:'
                placeholder='Last name:'
                inputProps={{ onChange: handleChangle, required: true }}
              />

              <Input
                id='occupation'
                name='occupation'
                label='What do you do?'
                placeholder='Engineer, student, PhD'
                inputProps={{ onChange: handleChangle, required: true }}
              />

              <Input
                id='photo'
                name='photo'
                label='Profile photo:'
                type='file'
                inputProps={{
                  accept: 'image/*',
                  onChange: handleChangle,
                  required: true,
                }}
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='mt-6 md:mt-8 px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-800'
            >
              Add member
            </button>
          </form>
        </section>
      </main>

      <footer></footer>
    </div>
  )
}
