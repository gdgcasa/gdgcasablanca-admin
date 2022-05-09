import { useAuth } from '@/lib/auth'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'
import AdminLayout from '../admin-layout'
import { EventAction } from './events'

export default function MembersScreen() {
  return (
    <AdminLayout headerTitle='Members'>
      <MembersList />
    </AdminLayout>
  )
}

function MembersList() {
  const { data, error } = useSWR<DbMember[]>('/api/members')

  if (error) {
    console.error(error)

    return <div>failed to load</div>
  }

  if (!data)
    return (
      <div className='flex flex-col gap-4'>
        <MemberShell />
        <MemberShell />
        <MemberShell />
        <MemberShell />
      </div>
    )

  return (
    <div className='flex flex-col gap-4'>
      {data.map((member) => {
        return <Member {...member} key={member.id} />
      })}
    </div>
  )
}

function MemberShell() {
  return (
    <div className='flex animate-pulse items-center gap-4 rounded bg-slate-100 p-2 text-left'>
      <div className='h-[68px] w-[68px] rounded-full bg-slate-200'></div>
      <div className=''>
        <div className='mb-1 h-4 w-32 rounded-full bg-slate-200'></div>
        <div className='h-3 w-20 rounded-full bg-slate-200'></div>
      </div>
    </div>
  )
}

function Member({
  photo,
  firstname,
  lastname,
  occupation,
  id,
  isPublic,
}: DbMember) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const canEdit = user?.role === 'admin' || user?.role === 'editor'

  const fullname = [firstname, lastname].join(' ')

  return (
    <Link href={`/members/${id}/edit`}>
      <a className='flex flex-col flex-wrap justify-between gap-4 rounded border border-slate-100 bg-white p-4 text-left shadow-sm transition-all hover:border-slate-50 hover:shadow-md sm:flex-row sm:items-center'>
        <div className='flex items-center gap-4'>
          <Image
            src={photo}
            alt={fullname}
            width={68}
            height={68}
            className='rounded-full'
          />
          <div>
            <h3>{fullname}</h3>
            <p className='text-sm text-slate-600'>{occupation}</p>
          </div>
        </div>
        <div className='flex gap-2'>
          {!canEdit ? null : (
            <EventAction href={`/members/${id}/publish`}>
              {isPublic ? 'Unpublish' : 'Publish'}
            </EventAction>
          )}

          {!isAdmin ? null : (
            <EventAction href={`/members/${id}/delete`}>Delete</EventAction>
          )}
        </div>
      </a>
    </Link>
  )
}
