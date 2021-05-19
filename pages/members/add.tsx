import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'

import Input from '@/components/input'
import { addMember } from '@/lib/db'

const initialState = {
  firstname: '',
  lastname: '',
  occupation: '',
  photo: null,
}

export default function Home() {
  const router = useRouter()
  const [formDataState, setFormDataState] = React.useState<Member>(initialState)
  const [loading, setLoading] = React.useState(false)

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault()
    setLoading(true)
    const ct = event.currentTarget

    try {
      await addMember(formDataState)

      ct.reset()
      setFormDataState(initialState)
      router.push('/')
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  function handleChangle(event: React.FormEvent<HTMLInputElement>) {
    const name = event.currentTarget.name

    let value: string | File = event.currentTarget.value
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
                inputProps={{
                  autoComplete: 'off',
                  onChange: handleChangle,
                  required: true,
                }}
              />

              <Input
                id='lastname'
                name='lastname'
                label='Last name:'
                placeholder='Last name:'
                inputProps={{
                  autoComplete: 'off',
                  onChange: handleChangle,
                  required: true,
                }}
              />

              <Input
                id='occupation'
                name='occupation'
                label='What do you do?'
                placeholder='Engineer, student, PhD'
                inputProps={{
                  autoComplete: 'off',
                  onChange: handleChangle,
                  required: true,
                }}
              />

              <Input
                id='photo'
                name='photo'
                label='Profile photo:'
                type='file'
                inputProps={{
                  autoComplete: 'off',
                  accept: 'image/*',
                  onChange: handleChangle,
                  required: true,
                }}
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className={`mt-6 md:mt-8 px-4 py-2 rounded text-white transition-colors ${
                loading ? 'bg-blue-300' : 'bg-green-600 hover:bg-green-800'
              }`}
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
