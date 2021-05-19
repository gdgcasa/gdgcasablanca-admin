import { getMembers } from '@/lib/admin-db'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const members = await getMembers()

  res.status(200).json(members)
}
