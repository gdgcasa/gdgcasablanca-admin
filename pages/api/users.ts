import { NextApiRequest, NextApiResponse } from 'next'

import { getEditorUsers } from '@/lib/admin-db'
import { parseTokenContext } from 'src/utils/get-uid-from-token-context'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await parseTokenContext(req.headers.cookie)
  if (!token) {
    res.status(401).json({ code: 401, message: 'Unauthorized' })
    return
  }

  const users = await getEditorUsers()

  res.status(200).json(users)
}
