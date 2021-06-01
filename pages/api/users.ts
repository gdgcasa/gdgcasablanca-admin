import { getEditorUsers } from '@/lib/admin-db'
import { NextApiRequest, NextApiResponse } from 'next'
import { parseTokenContext } from 'src/utils/get-uid-from-token-context'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { uid } = await parseTokenContext(req.headers.cookie)
  if (!uid) {
    res.status(401).json({ code: 401, message: 'Unauthorized' })
  }

  const users = await getEditorUsers()

  res.status(200).json(users)
}
