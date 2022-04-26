import DefaultHead from '@/components/default-head'
import AddEventScreen from '@/components/screens/add-event'

export default function EventsPage() {
  return (
    <div className='text-slate-900'>
      <DefaultHead title='Add event' />

      <AddEventScreen />
    </div>
  )
}
