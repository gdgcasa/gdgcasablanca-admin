import { NextApiRequest, NextApiResponse } from 'next'

import { addNewEvent, getAdminUserRole, getEvents } from '@/lib/admin-db'
import { parseTokenContext } from 'src/utils/get-uid-from-token-context'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { uid: adminUid } = await parseTokenContext(req.headers.cookie)

  if (!adminUid) {
    res.status(401).json({ code: 401, message: 'Unauthorized' })
    return
  }

  const role = await getAdminUserRole(adminUid)
  const isAdmin = role === 'admin'
  if (!isAdmin) {
    res.status(403).json({ code: 403, message: 'Unauthorized' })
    return
  }

  const { meetupId, organizers } = req.body

  const { dbEvents } = await getEvents()

  if (dbEvents.some((event) => event.meetupId === meetupId)) {
    res.status(200).json({ code: 200, message: 'Event already exists' })
    return
  }

  try {
    await addNewEvent(meetupId, organizers)
  } catch (e) {
    res.status(500).json({ code: 500, message: 'Internal server error' })
    return
  }

  res.status(204).end()
}
