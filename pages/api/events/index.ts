import { NextApiRequest, NextApiResponse } from 'next'

import { getEvents } from '@/lib/admin-db'
import { parseTokenContext } from 'src/utils/get-uid-from-token-context'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { uid } = await parseTokenContext(req.headers.cookie)
  if (!uid) {
    res.status(401).json({ code: 401, message: 'Unauthorized' })
  }

  let allEvents = null
  try {
    allEvents = await getEvents()
  } catch (e) {
    res.status(500).json({ code: 500, message: 'Internal server error' })
    return
  }

  res.status(200).json(allEvents)
}
