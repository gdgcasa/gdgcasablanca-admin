import { getMember } from '@/lib/admin-db'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query

  const member = await getMember(id as string)

  res.status(200).json(member)
}
