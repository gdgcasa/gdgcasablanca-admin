import Head from 'next/head'
import { useRouter } from 'next/router'
import useSWR from 'swr'

import MemberForm from '@/components/member-form'
import { editMember } from '@/lib/db'
import DefaultHead from '@/components/default-head'

export default function EditMember() {
  const router = useRouter()
  const {
    query: { id },
  } = router

  const { data, error } = useSWR<DbMember>(`/api/members/${id}`)

  if (error) {
    console.error(error)

    return <div>failed to load</div>
  }

  if (!id || !data) {
    return <div>Loading ...</div>
  }

  async function handleSubmit(formDataState): Promise<void> {
    try {
      await editMember(formDataState)

      router.push('/members')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <DefaultHead title='Editing Member' />

      <main className='mx-auto p-4 md:max-w-4xl md:p-8'>
        <h2 className='mb-4 text-2xl'>
          Editing{' '}
          <span className='font-bold text-gray-700'>
            {data.firstname} {data.lastname}
          </span>
        </h2>

        <MemberForm onSubmit={handleSubmit} initialState={data} />
      </main>
    </div>
  )
}
