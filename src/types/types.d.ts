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

type ErrorReturnType = { code: Exclude<HTTPStatusCode, 200>; message: string }
type EventsDataReturnType = {
  code: 200
  data: EventsDataType
}
type EventsReturnType = EventsDataReturnType | ErrorReturnType

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
    name?: string
    city?: string
    link: string
  }
}

type HTTPStatusCode =
  | 100
  | 101
  | 102
  | 103
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 208
  | 226
  | 300
  | 301
  | 302
  | 303
  | 304
  | 305
  | 306
  | 307
  | 308
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 425
  | 426
  | 428
  | 429
  | 431
  | 451
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 510
  | 511
  | 599
  | null
