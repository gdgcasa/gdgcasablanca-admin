import Head from 'next/head'
import Link from 'next/link'
import useSWR from 'swr'

import Header from '@/components/header'
import { useAuth } from '@/lib/auth'

export default function Members() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const canEdit = user?.role === 'admin' || user?.role === 'editor'
  const { data, error } = useSWR<DbMember[]>('/api/members')

  if (error) {
    console.error(error)

    return <div>failed to load</div>
  }
  if (!data) return <div>loading...</div>

  return (
    <div>
      <Head>
        <title>Members - GDG Casablanca Admin</title>
        <meta name='description' content='Admin - GDG Casablanca' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />

      <main>
        <section className='mx-auto flex flex-col gap-y-2 py-4 md:max-w-4xl md:py-8'>
          {data.map(
            ({ firstname, lastname, id, photo, occupation, url, isPublic }) => {
              const fullname = [firstname, lastname].join(' ')

              return (
                <div
                  key={id}
                  className='flex items-center gap-x-3 rounded py-2 px-4 hover:bg-gray-100 md:py-4 md:px-8'
                >
                  <img
                    src={photo}
                    alt={fullname}
                    className='h-14 w-14 rounded-full object-cover'
                  />
                  <div>
                    <h3 className='text-lg capitalize text-gray-900'>
                      {fullname}
                    </h3>
                    <p className='text-sm text-gray-700'>{occupation}</p>
                  </div>
                  <div className='flex-grow' />
                  {!url ? null : (
                    <a
                      href={url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-teal-500 hover:text-teal-700'
                    >
                      Social media link
                    </a>
                  )}

                  {!canEdit ? null : (
                    <>
                      <a
                        href={`/members/${id}/edit`}
                        className='rounded border-2 border-current px-2 text-teal-600 hover:bg-teal-50 hover:text-teal-800'
                      >
                        Edit
                      </a>
                      <Link href={`/members/${id}/publish`}>
                        <a className='rounded border-2 border-current px-2 text-blue-600 hover:bg-blue-50 hover:text-blue-800'>
                          {isPublic ? 'Unpublish' : 'Publish'}
                        </a>
                      </Link>
                    </>
                  )}

                  {!isAdmin ? null : (
                    <Link href={`/members/${id}/delete`}>
                      <a className='rounded border-2 border-current px-2 text-red-600 hover:bg-red-50 hover:text-red-800'>
                        Delete
                      </a>
                    </Link>
                  )}
                </div>
              )
            },
          )}
        </section>
      </main>

      <footer></footer>
    </div>
  )
}
