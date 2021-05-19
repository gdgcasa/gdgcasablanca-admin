import Head from 'next/head'
import { useRouter } from 'next/router'
import useSWR from 'swr'

import Header from '@/components/header'
import MemberForm from '@/components/member-form'
import { editMember } from '@/lib/db'

export default function EditMember() {
  const router = useRouter()
  const {
    query: { id },
  } = router

  const { data, error, isValidating } = useSWR<DbMember>(`/api/members/${id}`)

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
      <Head>
        <title>Edit member - GDG Casablanca Admin</title>
        <meta name='description' content='Admin - GDG Casablanca' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='p-4 md:p-8 md:max-w-4xl mx-auto'>
        <h2 className='mb-4 text-2xl'>
          Editing{' '}
          <span className='font-bold text-gray-700'>
            {data.firstname} {data.lastname}
          </span>
        </h2>

        {isValidating ? null : (
          <MemberForm onSubmit={handleSubmit} initialState={data} />
        )}
      </main>
    </div>
  )
}
