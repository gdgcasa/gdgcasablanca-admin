import DefaultHead from '@/components/default-head'
import HeaderOld from '@/components/header-old'
import AdminDash from '@/components/screens/admin-dash'
import { getAdminUserRole } from '@/lib/admin-db'
import getUidFromTokenContext from 'src/utils/get-uid-from-token-context'

export default function Admin() {
  return (
    <div>
      <DefaultHead title='Admin' />

      <HeaderOld />
      <main className='mx-auto p-4 md:max-w-4xl md:p-8'>
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
