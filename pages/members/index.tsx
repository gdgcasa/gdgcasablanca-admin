import Head from 'next/head'
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
        <section className='flex flex-col gap-y-4 p-4 md:p-8 md:max-w-4xl mx-auto'>
          {data.map(({ firstname, lastname, id, photo, occupation, url }) => {
            const fullname = [firstname, lastname].join(' ')
            return (
              <div key={id} className='flex gap-x-3 items-center'>
                <img
                  src={photo}
                  alt={fullname}
                  className='w-14 h-14 rounded-full'
                />
                <div>
                  <h3 className='text-lg text-gray-900'>{fullname}</h3>
                  <p className='text-sm text-gray-700'>{occupation}</p>
                  {!url ? null : (
                    <a href={url} target='_blank' rel='noopener noreferrer'>
                      {url}
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </section>
      </main>

      <footer></footer>
    </div>
  )
}
