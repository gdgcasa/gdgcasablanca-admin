const UPCOMING_EVENTS =
  'https://api.meetup.com/gdgcasablanca/events?photo-host=public&page=5'

const NUMBER_OF_PAST_EVENTS = 3
const PAST_EVENTS = `https://api.meetup.com/gdgcasablanca/events?photo-host=public&status=past`

const GET_EVENT_QUERY = `
  query ($id: ID!) {
    event(id: $id) {
      title
      eventUrl
      dateTime
      id
      is_online_event: isOnline
      image {
        id
        baseUrl
      }
      images {
        preview
      }
      venue {
        name
        city
        lat
        lng
      }
    }
  }
`

type GenericEventType = { [key: string]: string | { [key: string]: string } }

export async function getMeetupEvent(id: string): Promise<GenericEventType> {
  const gqlUrl = 'https://api.meetup.com/gql'
  try {
    const res = await fetch(gqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
      body: JSON.stringify({
        query: GET_EVENT_QUERY,
        variables: { id },
      }),
    })
    const result = await res.json()

    if (result.errors) {
      throw new Error(result.errors[0].message)
    } else {
      return formatEventV2(result.data.event)
    }
  } catch (e) {
    console.log({ e })
    return {}
  }
}

export default async function getMeetupEvents() {
  const [eventsData, pastEventsData] = await Promise.all([
    fetch(UPCOMING_EVENTS).then((d) => d.json()),
    fetch(PAST_EVENTS).then((d) => d.json()),
  ])

  const formattedEvents = eventsData.map(formatEvent)
  const events = formattedEvents.reduce(mapToObject, {})

  const sortedPastEvents = pastEventsData.sort(sortEvenst).map(formatEvent)
  const pastEvents = sortedPastEvents
    .slice(0, NUMBER_OF_PAST_EVENTS)
    .reduce(mapToObject, {})
  const allPastEvents = sortedPastEvents.reduce(mapToObject, {})

  return {
    events,
    pastEvents,
    allPastEvents,
    allEvents: [...formattedEvents, ...sortedPastEvents],
  }
}

function mapToObject(acc, cur) {
  return { ...acc, [cur.id]: cur }
}

function sortEvenst(a, b) {
  return b.time - a.time
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export function formatDate(date) {
  const eventDate = new Date(date)

  const year = eventDate.getFullYear()
  const month = months[eventDate.getMonth()]
  const day = eventDate.getDate()

  return `${month} ${day}, ${year}`
}

function formatEventV2(eventData): GenericEventType {
  const is_online_event = eventData.is_online_event
  const meetupVenue = eventData.venue

  let link = ''
  if (!is_online_event && meetupVenue?.lat && meetupVenue?.lon) {
    link = `https://www.google.com/maps/@${meetupVenue.lat},${meetupVenue.lon},16z`
  }

  const venue = {
    name: is_online_event ? 'Online Event' : meetupVenue?.name,
    city: meetupVenue?.city,
    link,
  }

  return {
    id: eventData.id,
    title: eventData.title,
    date: formatDate(eventData.dateTime),
    eventLink: eventData.eventUrl,
    timeFrom: '',
    venue,
    is_online_event,
  }
}

export function formatEvent(eventData) {
  const {
    local_date: localDate,
    name: title,
    link: eventLink,
    local_time: timeFrom,
    venue: meetupVenue,
    is_online_event,
    id,
  } = eventData

  const date = formatDate(localDate)

  const entries = []
  if (meetupVenue) {
    if (meetupVenue?.is_online_event) {
      entries.push(meetupVenue.name)
    } else if (meetupVenue.name) {
      entries.push(meetupVenue.name)
    }
    if (meetupVenue.city) {
      entries.push(meetupVenue.city)
    }
  }

  let link = ''
  if (!meetupVenue?.is_online_event) {
    if (meetupVenue?.lat && meetupVenue?.lon) {
      link = `https://www.google.com/maps/@${meetupVenue?.lat},${meetupVenue?.lon},17z`
    }
  }

  const venue = {
    name: meetupVenue?.name,
    city: meetupVenue?.city,
    link,
  }

  const event = {
    id,
    title,
    date,
    eventLink,
    timeFrom,
    venue,
    is_online_event,
  }

  return event
}
