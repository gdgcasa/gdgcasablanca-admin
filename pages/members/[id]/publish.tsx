import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'

import DefaultHead from '@/components/default-head'
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
    return <div className='mx-auto p-4 md:max-w-4xl md:p-8'>Loading ...</div>
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
      <DefaultHead title='Edit member' />

      <main className='mx-auto p-4 md:max-w-4xl md:p-8'>
        <h2 className='mb-4 text-2xl'>
          Managing{' '}
          <span className='font-bold text-gray-700'>
            {member.firstname} {member.lastname}
          </span>
        </h2>

        <div className='inline-flex items-center gap-x-4 rounded-lg bg-gray-50 p-4 shadow md:p-8'>
          <Image
            src={member.photo}
            alt={`${member.firstname} ${member.lastname}`}
            className='rounded-full'
            width={112}
            height={112}
          />
          <div>
            <div className='text-xl font-bold capitalize'>
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

          <div className='mt-4 flex gap-x-4'>
            <button
              className={`rounded border-2 px-2 py-1 text-white ${
                loading
                  ? 'cursor-wait border-blue-400 bg-blue-400'
                  : 'border-blue-700 bg-blue-700 hover:border-blue-900 hover:bg-blue-900'
              }`}
              disabled={loading}
            >
              Yes, I'm sure. {member.isPublic ? 'Unpublish' : 'Publish'}
            </button>
            <Link href={loading ? '' : '/members'}>
              <a className='rounded border-2 border-current px-2 py-1 text-gray-700 hover:bg-gray-50 hover:text-gray-900'>
                Nope, cancel
              </a>
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
