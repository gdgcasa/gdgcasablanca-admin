import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import getUidFromTokenContext from 'src/utils/get-uid-from-token-context'
import { useAuth } from '@/lib/auth'

export default function Home() {
  const { loading } = useAuth()

  return (
    <div>
      <Head>
        <title>GDG Casablanca Admin</title>
        <meta name='description' content='Admin - GDG Casablanca' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <section className='p-4 md:p-8 md:max-w-4xl mx-auto'>
          {loading ? (
            <div>Loading ...</div>
          ) : (
            <Link href='/login'>
              <a>Login to access the members list</a>
            </Link>
          )}
        </section>
      </main>

      <footer></footer>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const uid = await getUidFromTokenContext(context)

  if (uid) {
    return {
      redirect: {
        destination: '/members',
        permanent: false,
      },
    }
  }

  return { props: {} }
}
