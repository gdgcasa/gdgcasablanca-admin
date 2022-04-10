import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'

import HeaderOld from '@/components/header-old'
import MemberForm from '@/components/member-form'
import { addMember } from '@/lib/db'
import getUidFromTokenContext from 'src/utils/get-uid-from-token-context'
import { getAdminUserRole } from '@/lib/admin-db'
import { useAuth } from '@/lib/auth'
import DefaultHead from '@/components/default-head'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div>
        <DefaultHead title='Add a member' />

        <HeaderOld />

        <main>
          <section className='mx-auto p-4 md:max-w-4xl md:p-8'>
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
      <DefaultHead title='Add a member' />

      <HeaderOld />

      <main>
        <section className='mx-auto p-4 md:max-w-4xl md:p-8'>
          <h2 className=' mb-4 text-2xl font-light md:mb-6 md:text-4xl'>
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
