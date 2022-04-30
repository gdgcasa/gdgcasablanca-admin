import { NextApiRequest, NextApiResponse } from 'next'

import { getEvent } from '@/lib/admin-db'
import { parseTokenContext } from 'src/utils/get-uid-from-token-context'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { uid } = await parseTokenContext(req.headers.cookie)
  if (!uid) {
    res.status(401).json({ code: 401, message: 'Unauthorized' })
  }

  const { id } = req.query

  let event = null
  try {
    event = await getEvent(id as string)
  } catch (e) {
    res.status(500).json({ code: 500, message: 'Internal server error' })
    return
  }

  res.status(200).json(event)
}
