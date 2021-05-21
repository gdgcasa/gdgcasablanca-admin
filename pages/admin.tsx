import DefaultHead from '@/components/default-head'
import Header from '@/components/header'
import AdminDash from '@/components/screens/admin-dash'
import { getAdminUserRole } from '@/lib/admin-db'
import getUidFromTokenContext from 'src/utils/get-uid-from-token-context'

export default function Admin() {
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
        destination: '/members',
        permanent: false,
      },
    }
  }

  return { props: {} }
}
