type DbMember = {
  id: string
  email: string
  firstname: string
  lastname: string
  occupation: string
  photo: string
  isPublic: boolean
  url?: string
}

type Member = Omit<DbMember, 'photo' | 'id' | 'isPublic'> & {
  photo: File | string
}

// This is a duplicate value, check the utils/constants file
const userRoles = ['user', 'admin', 'editor'] as const
type UserRole = typeof userRoles[number]

type UserType = {
  uid: string
  email: string | null
  name: string | null
  provider: string
  photoUrl: string | null
  token: string
  role: UserRole
} | null

// not used for now
type EventPageType = {
  link: string
  name: string
}

type EventsDataType = {
  dbEvents: EventType[]
  events: { [id: string]: EventType }
  pastEvents: { [id: string]: EventType }
  allEvents: EventType[]
}

type OrganizerType = {
  id: string
  email: string
  lastname: string
  firstname: string
  isPublic: boolean
  occupation?: string
  photo?: string
  url?: string
}

type EventType = {
  // from firebase
  id: string
  meetupId: string
  eventPages: EventPageType[]
  organizers: OrganizerType[]

  // from meetup
  title: string
  is_online_event: boolean
  date: string
  eventLink: string
  timeFrom: StringLike
  venue: {
    name: string
    city: string
    link: string
  }
}
