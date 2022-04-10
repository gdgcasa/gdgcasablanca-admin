import DefaultHead from '@/components/default-head'
import AdminsScreen from '@/components/screens/admins'

export default function MembersPage() {
  return (
    <div className='text-slate-900'>
      <DefaultHead title='Admins' />

      <AdminsScreen />
    </div>
  )
}
