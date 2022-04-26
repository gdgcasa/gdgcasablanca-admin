import DefaultHead from '@/components/default-head'
import EventsScreen from '@/components/screens/events'

export default function EventsPage() {
  return (
    <div className='text-slate-900'>
      <DefaultHead title='Events' />

      <EventsScreen />
    </div>
  )
}
