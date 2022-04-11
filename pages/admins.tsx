import DefaultHead from '@/components/default-head'
import AdminsScreen from '@/components/screens/admins'
import { getAdminUserRole } from '@/lib/admin-db'
import getUidFromTokenContext from 'src/utils/get-uid-from-token-context'

export default function MembersPage() {
  return (
    <div className='text-slate-900'>
      <DefaultHead title='Admins' />

      <AdminsScreen />
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
