import DefaultHead from '@/components/default-head'
import EditEventScreen from '@/components/screens/edit-event'

export default function EventsPage() {
  return (
    <div className='text-slate-900'>
      <DefaultHead title='Edit event' />

      <EditEventScreen />
    </div>
  )
}
