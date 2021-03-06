import { compareDesc } from 'date-fns'
import {
  eventsCollection,
  membersCollection,
  usersCollection,
} from 'src/config'
import {
  getEventFromSnapshot,
  getEventsFromSnapshot,
  getItemsFromSnapshot,
} from 'src/utils'

import admin from './admin-firebase'
import getMeetupEvents, { getMeetupEvent } from './meetup-events'

const db = admin.firestore()

async function getMembers(
  publishedOnly: boolean = true,
): Promise<Array<DbMember>> {
  let snapshot = null
  const snapbase = db.collection(membersCollection)

  if (publishedOnly) {
    snapshot = await snapbase.where('isPublic', '==', true).get()
  } else {
    snapshot = await snapbase.get()
  }

  const members = getItemsFromSnapshot<DbMember>(snapshot)

  return members
}

async function getMember(id: string): Promise<DbMember | null> {
  const doc = await db.collection(membersCollection).doc(id).get()

  if (!doc.exists) {
    return null
  }

  const memberWithoutId = doc.data() as Omit<DbMember, 'id'>

  return { id: doc.id, ...memberWithoutId }
}

async function getAdminUserRole(uid: string): Promise<UserRole> {
  const dbUser = await db.collection(usersCollection).doc(uid).get()

  if (!dbUser.exists) {
    throw new Error(`User doen't exist`)
  }

  return dbUser.get('role')
}

async function getEditorUsers(): Promise<UserType[]> {
  const snapshot = await db.collection(usersCollection).get()

  const users = getItemsFromSnapshot<UserType>(snapshot)

  return users
}

async function getEvent(id: string): Promise<EventType | null> {
  const doc = await db.collection(eventsCollection).doc(id).get()

  if (!doc.exists) {
    return null
  }

  const dbEvent = (await getEventFromSnapshot(doc)) as Omit<EventType, 'id'>

  const { id: _, ...meetupEvent } = await getMeetupEvent(dbEvent?.meetupId)

  return { id: doc.id, ...dbEvent, ...meetupEvent }
}

async function getEvents(): Promise<EventsDataType> {
  const snapshot = await db.collection(eventsCollection).get()

  const { events, pastEvents, allPastEvents, allEvents } =
    await getMeetupEvents()
  let dbEvents = await getEventsFromSnapshot<EventType>(snapshot)

  dbEvents = dbEvents
    .map((event) => {
      const past = allPastEvents?.[event.meetupId]
      const upcoming = events?.[event.meetupId]
      const { id: __, ...meetupData } = past ?? upcoming ?? {}

      return { ...event, ...meetupData }
    })
    .sort((eventA, eventB) => {
      const dateLeft = new Date(eventA.date)
      const dateRight = new Date(eventB.date)
      return compareDesc(dateLeft, dateRight)
    })

  return { dbEvents, events, pastEvents, allEvents }
}

async function changeMemberRole(
  uid: UserType['uid'],
  newRole: UserType['role'],
) {
  return db.collection(usersCollection).doc(uid).update({ role: newRole })
}

async function addNewEvent(meetupId, organizersArray) {
  const promises = organizersArray.map((id) => {
    return db
      .collection(membersCollection)
      .doc(id)
      .get()
      .then((res) => res.ref)
  })
  const organizers = await Promise.all(promises)

  const event = { meetupId, organizers }

  return db.collection(eventsCollection).add(event)
}

async function updateEvent(id, meetupId, organizersArray) {
  const promises = organizersArray.map((id) => {
    return db
      .collection(membersCollection)
      .doc(id)
      .get()
      .then((res) => res.ref)
  })
  const organizers = await Promise.all(promises)

  const event = { meetupId, organizers }

  return db.collection(eventsCollection).doc(id).set(event)
}

export {
  getMembers,
  getMember,
  getAdminUserRole,
  getEditorUsers,
  changeMemberRole,
  getEvents,
  getEvent,
  addNewEvent,
  updateEvent,
}
