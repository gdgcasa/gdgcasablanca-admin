import Head from 'next/head'
import Link from 'next/link'

import Header from '@/components/header'

export default function Home() {
  return (
    <div>
      <Head>
        <title>GDG Casablanca Admin</title>
        <meta name='description' content='Admin - GDG Casablanca' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />

      <main>
        <section className='p-4 md:p-8 md:max-w-4xl mx-auto'>
          <Link href='/members/add'>
            <a>Add a member</a>
          </Link>
        </section>
      </main>

      <footer></footer>
    </div>
  )
}
