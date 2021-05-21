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
    <div className='min-h-screen max-h-96 bg-gray-50'>
      <DefaultHead title='Login - GDG Casablanca admin' />

      <main className='p-4 md:p-8 md:max-w-4xl mx-auto'>
        <h1 className='text-2xl font-light text-gray-800'>Login</h1>

        <section className='py-4'>
          <button
            type='button'
            onClick={() => signinWithGoogle('/members')}
            className='px-4 py-2 border border-gray-100 bg-white rounded text-gray-800 hover:bg-gray-100 transition-colors'
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
