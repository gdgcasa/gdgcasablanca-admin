import Head from 'next/head'
import Link from 'next/link'
import useSWR from 'swr'

import Header from '@/components/header'

export default function Members() {
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
        <section className='flex flex-col gap-y-2 py-4 md:py-8 md:max-w-4xl mx-auto'>
          {data.map(({ firstname, lastname, id, photo, occupation, url }) => {
            const fullname = [firstname, lastname].join(' ')
            return (
              <div
                key={id}
                className='flex gap-x-3 py-2 px-4 md:px-8 items-center hover:bg-gray-50'
              >
                <img
                  src={photo}
                  alt={fullname}
                  className='w-14 h-14 rounded-full'
                />
                <div>
                  <h3 className='text-lg text-gray-900 capitalize'>
                    {fullname}
                  </h3>
                  <p className='text-sm text-gray-700'>{occupation}</p>
                  {!url ? null : (
                    <a
                      href={url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-green-500 hover:text-green-700'
                    >
                      Social media link
                    </a>
                  )}
                </div>

                <a
                  href={`/members/${id}/edit`}
                  className='ml-auto px-2 border-2 border-current rounded text-green-600 hover:text-green-800 hover:bg-green-50'
                >
                  Edit
                </a>
              </div>
            )
          })}
        </section>
      </main>

      <footer></footer>
    </div>
  )
}
