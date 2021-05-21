// import { useRouter } from 'next/router'

import DefaultHead from '@/components/default-head'
import Header from '@/components/header'
import AdminDash from '@/components/screens/admin-dash'
// import { useAuth } from '@/lib/auth'
import { getAdminUserRole } from '@/lib/admin-db'
import getUidFromTokenContext from 'src/utils/get-uid-from-token-context'

export default function Admin() {
  // const router = useRouter()
  // const { user, loading, status } = useAuth()

  // if (!user && !loading && typeof window !== 'undefined') {
  //   router.push('/login')
  // }

  // console.log(user, loading, status)

  return (
    <div>
      <DefaultHead title='Admin - GDG Casablanca admin' />

      <Header />
      <main className='p-4 md:p-8 md:max-w-4xl mx-auto'>
        <AdminDash />
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  const uid = await getUidFromTokenContext(context)

  if (!uid) {
    console.log({ uid: 'noUid' })
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const role = await getAdminUserRole(uid)

  const isAdmin = role === 'admin'

  if (!isAdmin) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return { props: {} }
}
