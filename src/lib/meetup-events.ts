const UPCOMING_EVENTS =
  'https://api.meetup.com/gdgcasablanca/events?&photo-host=public&page=5'

const NUMBER_OF_PAST_EVENTS = 3
const PAST_EVENTS = `https://api.meetup.com/gdgcasablanca/events?&photo-host=public&status=past`

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
