import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'

import Header from '@/components/header'
import MemberForm from '@/components/member-form'
import { addMember } from '@/lib/db'
import getUidFromTokenContext from 'src/utils/get-uid-from-token-context'
import { getAdminUserRole } from '@/lib/admin-db'
import { useAuth } from '@/lib/auth'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  if (loading) {
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
            loading ...
          </section>
        </main>
      </div>
    )
  }

  const canAddMember = user.role === 'admin' || user.role === 'editor'

  if (!canAddMember) {
    router.push('/members')
  }

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

export async function getServerSideProps(context) {
  const uid = await getUidFromTokenContext(context)

  if (!uid) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const role = await getAdminUserRole(uid)

  const canAddMember = role === 'admin' || role === 'editor'

  if (!canAddMember) {
    return {
      redirect: {
        destination: '/members',
        permanent: false,
      },
    }
  }

  return { props: {} }
}
