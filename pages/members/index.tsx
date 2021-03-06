import DefaultHead from '@/components/default-head'
import MembersScreen from '@/components/screens/members'

export default function MembersPage() {
  return (
    <div className='text-slate-900'>
      <DefaultHead title='Members' />

      <MembersScreen />
    </div>
  )
}
