import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'

import Header from '@/components/header'
import MemberForm from '@/components/member-form'
import { addMember } from '@/lib/db'

export default function Home() {
  const router = useRouter()

  async function handleSubmit(formDataState): Promise<void> {
    try {
      await addMember(formDataState)

      router.push('/members')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Head>
        <title>Add a member - GDG Casablanca Admin</title>
        <meta name='description' content='Admin - GDG Casablanca' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />

      <main>
        <section className='p-4 md:p-8 md:max-w-4xl mx-auto'>
          <h2 className=' mb-4 md:mb-6 text-2xl md:text-4xl font-light'>
            Add a member
          </h2>

          <MemberForm onSubmit={handleSubmit} />
        </section>
      </main>

      <footer></footer>
    </div>
  )
}
