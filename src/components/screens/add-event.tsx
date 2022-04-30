import { useRouter } from 'next/router'
import * as React from 'react'
import Select, { ActionMeta, MultiValue } from 'react-select'
import useSWR from 'swr'

import AdminLayout from '../admin-layout'
import Button from '../ui/button'

export default function AddEventScreen() {
  return (
    <AdminLayout headerTitle='Add event'>
      <EventForm />
    </AdminLayout>
  )
}

function EventForm() {
  const router = useRouter()

  const { data: members } = useSWR<DbMember[]>('/api/members')

  const { data } = useSWR<EventsDataType>('/api/events')
  const { allEvents, dbEvents } = data ?? {}

  const [formDataState, setFormDataState] = React.useState<{
    event: { [id: string]: string } | null
    organizers: { [id: string]: string }[]
  } | null>()

  async function addNewEvent(body) {
    const res = await fetch('/api/events/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      router.push('/events')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const body = {
      meetupId: formDataState.event.value,
      organizers: formDataState.organizers.map((o) => o.value),
    }

    await addNewEvent(body)
  }

  function handleChangeSelect(
    value: MultiValue<any>,
    actionMeta: ActionMeta<any>,
  ) {
    const { name } = actionMeta
    setFormDataState((prevData) => ({ ...prevData, [name]: value }))
  }

  const memberOptions = React.useMemo(() => {
    if (!members) {
      return []
    }

    return members.map(({ id: value, firstname, lastname, ...other }) => ({
      label: `${firstname} ${lastname}`,
      value,
      ...other,
    }))
  }, [members])
  const eventOptions = React.useMemo(() => {
    if (!allEvents || !dbEvents) {
      return []
    }

    const dbEventIds = dbEvents.map((e) => e.meetupId)
    return allEvents
      .filter(({ id }) => !dbEventIds.includes(id))
      .map(({ title, id, ...other }) => ({
        ...other,
        label: title,
        value: id,
      }))
  }, [dbEvents, allEvents])

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <div className='flex flex-col gap-3'>
        <label htmlFor='organizers'>Event:</label>
        <Select
          name='event'
          value={formDataState?.['event']}
          onChange={handleChangeSelect}
          options={eventOptions}
        />
      </div>
      <div className='flex flex-col gap-3'>
        <label htmlFor='organizers'>Organizers:</label>
        <Select
          name='organizers'
          value={formDataState?.['organizers']}
          onChange={handleChangeSelect}
          isMulti
          options={memberOptions}
        />
      </div>

      <Button className='min-w-[120px] self-start' type='submit'>
        Add event
      </Button>
    </form>
  )
}

// function Field({ name, label, type, inputProps }) {
//   return (
//     <Input
//       id={name}
//       name={name}
//       type={type}
//       label={label + (type === 'checkbox' ? '' : ':')}
//       placeholder={label}
//       inputProps={inputProps}
//     />
//   )
// }
