import { useRouter } from 'next/router'
import useSWR from 'swr'
import AdminLayout from '../admin-layout'

export default function EditEventScreen() {
  return (
    <AdminLayout headerTitle='Edit event'>
      <EditEvent />
    </AdminLayout>
  )
}

function EditEvent() {
  const router = useRouter()
  const { id } = router.query

  const { data, error } = useSWR(!id ? null : `/api/event/${id}`)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return <pre>{JSON.stringify(data, undefined, 2)}</pre>
}
