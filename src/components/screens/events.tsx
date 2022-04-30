import cx from 'classnames'
import Link from 'next/link'
import * as React from 'react'
import useSWR from 'swr'

import AdminLayout from '../admin-layout'

export default function EventsScreen() {
  return (
    <AdminLayout
      headerTitle='Events'
      mainClassName='flex flex-col items-start gap-4'
    >
      <EventsContent />
    </AdminLayout>
  )
}

function EventsContent() {
  const { data, error } = useSWR<EventsDataType>('/api/events')

  if (error) return <div>Failed to load</div>

  if (!data) return <div>Loading...</div>
  const { dbEvents } = data

  return (
    <>
      <div className='flex w-full gap-4 '>
        <InitiateEventAdition />
      </div>

      <EventList events={dbEvents} />
    </>
  )
}

function InitiateEventAdition() {
  return (
    <>
      <div className='w-full' />

      <Link href='/events/add'>
        <a className='inline-block whitespace-nowrap rounded-md bg-blue-500 py-2 px-3 text-sm font-semibold text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 active:shadow-none active:ring-1 active:ring-offset-2'>
          Add new event
        </a>
      </Link>
    </>
  )
}

const ArrowUp = ({ className = '' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={cx('h-6 w-6', className)}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    stroke-width='2'
  >
    <path
      stroke-linecap='round'
      stroke-linejoin='round'
      d='M5 10l7-7m0 0l7 7m-7-7v18'
    />
  </svg>
)

function EventAction({
  href,
  className,
  children,
  external = false,
}: {
  href?: string
  className?: string
  children: React.ReactNode
  external?: boolean
}) {
  const props = React.useMemo(() => {
    if (href) {
      return {
        href,
        target: external ? '_blank' : null,
      }
    }
    return {}
  }, [href, external])

  return (
    <a
      {...props}
      className={cx(
        'inline-flex h-8 min-w-[70px] items-center justify-center gap-x-2 whitespace-nowrap rounded-md border border-slate-200 px-2.5 py-1 text-sm text-slate-600 transition-colors hover:border-slate-800 hover:text-slate-900',
        className,
      )}
    >
      <span>{children}</span>
      {!external ? null : <ArrowUp className='h-3 w-3 rotate-45' />}
    </a>
  )
}

function EventList({ events }: { events: EventType[] }) {
  return (
    <>
      <h3 className='whitespace-nowrap text-sm font-bold uppercase text-slate-500'>
        Past events
      </h3>
      <ul className='w-full space-y-4'>
        {events.map((event) => {
          return (
            <li
              key={event.id}
              className='flex flex-col items-start gap-y-3 rounded border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-slate-50 hover:shadow-lg sm:items-stretch'
            >
              <div className='flex items-start justify-between'>
                <div>
                  <div className='text-sm font-bold tracking-wide text-slate-600'>
                    {event.date}
                  </div>
                  <h4 className='text-2xl'>{event.title}</h4>
                </div>

                <div className='hidden gap-2 sm:flex'>
                  <EventAction href={`/events/edit/${event.id}`}>Edit</EventAction>
                  <EventAction href={event.eventLink} external>
                    Meetup page
                  </EventAction>
                </div>
              </div>

              <div className='text-salte-600'>
                <span className='font-bold'>{event.organizers.length}</span>{' '}
                Organizer
                {event.organizers.length === 1 ? null : 's'}
              </div>

              <div className='flex gap-2 sm:hidden'>
                <EventAction href={`/events/edit/${event.id}`}>Edit</EventAction>
                <EventAction href={event.eventLink} external>
                  Meetup page
                </EventAction>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}
