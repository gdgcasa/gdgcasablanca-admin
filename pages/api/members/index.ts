import { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'

import { getMembers } from '@/lib/admin-db'
import initMiddleware from '@/lib/init-middlewares'

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    origin: ['http://localhost:8000', 'https://gdgcasablanca.com'],
  }),
)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Run cors
  await cors(req, res)

  const members = await getMembers()

  res.status(200).json(members)
}
