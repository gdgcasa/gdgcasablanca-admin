import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'

import { useAuth } from '@/lib/auth'
import { togglePublishMember } from '@/lib/db'
import getRole from 'src/utils/get-role'

export default function PublishMember() {
  const [loading, setloading] = useState(false)
  const { user } = useAuth()
  const { canEdit } = getRole(user)

  const router = useRouter()
  const {
    query: { id },
  } = router

  const { data: member, error } = useSWR<DbMember>(`/api/members/${id}`)

  if (!canEdit && typeof window !== 'undefined') {
    router.push('/members')
  }

  if (error) {
    console.error(error)

    return <div>failed to load</div>
  }

  if (!id || !member) {
    return <div>Loading ...</div>
  }

  async function handleSubmit(event): Promise<void> {
    event.preventDefault()
    setloading(true)
    try {
      await togglePublishMember(member)

      setloading(false)
      router.push('/members')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Head>
        <title>Edit member - GDG Casablanca Admin</title>
        <meta name='description' content='Admin - GDG Casablanca' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='p-4 md:p-8 md:max-w-4xl mx-auto'>
        <h2 className='mb-4 text-2xl'>
          Managing{' '}
          <span className='font-bold text-gray-700'>
            {member.firstname} {member.lastname}
          </span>
        </h2>

        <div className='inline-flex gap-x-4 items-center p-4 md:p-8 bg-gray-50 shadow rounded-lg'>
          <img
            src={member.photo}
            alt={`${member.firstname} ${member.lastname}`}
            className='w-28 h-28 rounded-full object-cover'
          />
          <div>
            <div className='text-xl capitalize font-bold'>
              {member.firstname} {member.lastname}
            </div>
            <div>{member.occupation}</div>
            <div>{member.email}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='mt-4'>
          <p className='text-xl text-gray-800'>
            Are you sure you want to {member.isPublic ? 'unpublish' : 'publish'}{' '}
            this member?
          </p>

          <div className='flex gap-x-4 mt-4'>
            <button
              className={`px-2 py-1 rounded text-white border-2 ${
                loading
                  ? 'border-blue-400 bg-blue-400 cursor-wait'
                  : 'border-blue-700 bg-blue-700 hover:bg-blue-900 hover:border-blue-900'
              }`}
              disabled={loading}
            >
              Yes, I'm sure. {member.isPublic ? 'Unpublish' : 'Publish'}
            </button>
            <Link href={loading ? '' : '/members'}>
              <a className='px-2 py-1 border-2 border-current rounded text-gray-700 hover:text-gray-900 hover:bg-gray-50'>
                Nope, cancel
              </a>
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
