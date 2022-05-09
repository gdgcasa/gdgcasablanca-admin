import { changeMemberRole, getAdminUserRole } from '@/lib/admin-db'
import { NextApiRequest, NextApiResponse } from 'next'
import { userRoles } from 'src/utils/constants'
import { parseTokenContext } from 'src/utils/get-uid-from-token-context'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await parseTokenContext(req.headers.cookie)

  if (!token) {
    res.status(401).json({ code: 401, message: 'Unauthorized' })
    return
  }
  const { uid: adminUid } = token

  const role = await getAdminUserRole(adminUid)
  const isAdmin = role === 'admin'
  if (!isAdmin) {
    res.status(403).json({ code: 403, message: 'Unauthorized' })
    return
  }

  const newRole = req.body.role
  const uid = req.body.uid

  if (!userRoles.includes(newRole)) {
    const message = `Unsupported role of "${newRole}"`
    res.status(400).json({ code: 400, message })
    return
  }

  await changeMemberRole(uid, newRole)

  res.status(204).end()
}
