import cx from 'classnames'
import Image from 'next/image'
import { useRouter } from 'next/router'
import * as React from 'react'
import toast, { Toaster } from 'react-hot-toast'
import type { ActionMeta, MultiValue } from 'react-select'
import ReactSelect from 'react-select'
import useSWR, { useSWRConfig } from 'swr'

import AdminLayout from '../admin-layout'
import Button from '../ui/button'
import { EventAction } from './events'

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

  const {
    data: event,
    error,
    isValidating,
  } = useSWR<EventType>(!id ? null : `/api/event/${id}`)

  if (error) return <div>Failed to load</div>
  if (!event) return <div>Loading...</div>

  return (
    <div>
      <div className='text-sm font-bold tracking-wide text-slate-600'>
        {event.date}
      </div>
      <h4 className='text-2xl'>{event.title}</h4>

      <h4 className='text-2xl'>
        {event.is_online_event ? 'Online event' : event.venue?.name}
      </h4>

      <EditForm
        id={event.id}
        organizers={event.organizers}
        meetupId={event.meetupId}
      />
      <ul
        className={cx('my-4 flex flex-col gap-2', {
          'bg-gray-100': isValidating,
        })}
      >
        {event.organizers.map((organizer) => {
          const fullName = `${organizer.firstname} ${organizer.lastname}`
          return (
            <li key={organizer.id} className='flex items-center gap-4'>
              <Image
                src={organizer?.photo}
                alt={fullName}
                width={32}
                height={32}
                className='rounded-full'
              />
              <span>{fullName}</span>
            </li>
          )
        })}
      </ul>
      <EventAction href={event.eventLink} external>
        Meetup page
      </EventAction>
    </div>
  )
}

type organizerOption = { value?: string; label?: string } & OrganizerType

function formatOrganizer({ id: value, firstname, lastname, ...other }) {
  return { label: `${firstname} ${lastname}`, value, ...other }
}

function EditForm({
  id,
  organizers,
  meetupId,
}: {
  id: string
  organizers: OrganizerType[]
  meetupId: string
}) {
  const { data: members } = useSWR<DbMember[]>('/api/members')
  const [formDataState, setFormDataState] = React.useState<{
    organizers: organizerOption[]
  } | null>({
    organizers: organizers.map(formatOrganizer) as organizerOption[],
  })

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

    return members.map(formatOrganizer)
  }, [members])

  const { mutate } = useSWRConfig()

  async function handleSubmit(e) {
    e.preventDefault()

    const newOrganizers = formDataState.organizers.map((o) => o.value)
    const body = { id, meetupId, organizers: newOrganizers }

    const res = fetch(`/api/events/update/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    toast.promise(res, {
      loading: 'Loading',
      success: () => {
        mutate(`/api/event/${id}`)
        return 'Update successful'
      },
      error: 'Update not successful',
    })
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-start gap-4'>
      <div className='flex w-full flex-col gap-3'>
        <label htmlFor='organizers'>Organizers:</label>
        <ReactSelect
          name='organizers'
          value={formDataState?.['organizers']}
          onChange={handleChangeSelect}
          isMulti
          options={memberOptions}
        />
      </div>

      <Button type='submit'>Update</Button>

      <Toaster />
    </form>
  )
}
