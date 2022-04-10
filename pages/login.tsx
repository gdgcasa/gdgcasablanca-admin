import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'

import DefaultHead from '@/components/default-head'
import { useAuth } from '@/lib/auth'
import getUidFromTokenContext from 'src/utils/get-uid-from-token-context'

export default function Login() {
  const router = useRouter()
  const { user, signinWithGoogle } = useAuth()

  if (user) {
    router.push('/')
  }

  return (
    <div className='max-h-96 min-h-screen bg-gray-50'>
      <DefaultHead title='Login' />

      <main className='mx-auto p-4 md:max-w-4xl md:p-8'>
        <h1 className='text-2xl font-light text-gray-800'>Login</h1>

        <section className='py-4'>
          <button
            type='button'
            onClick={() => signinWithGoogle('/members')}
            className='rounded border border-gray-100 bg-white px-4 py-2 text-gray-800 transition-colors hover:bg-gray-100'
          >
            Continue with <span className='font-bold'>Google</span>
          </button>
        </section>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const uid = await getUidFromTokenContext(context)

  if (uid) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return { props: {} }
}
