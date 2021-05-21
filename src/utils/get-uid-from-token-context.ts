import { ParsedUrlQuery } from 'querystring'
import { GetServerSidePropsContext } from 'next'

import admin from '@/lib/admin-firebase'

import { parseCookie } from './parse-cookies'

const auth = admin.auth()

export default async function getUidFromTokenContext(
  context: GetServerSidePropsContext<ParsedUrlQuery>,
): Promise<string> {
  const { token } = parseCookie(context.req.headers.cookie)

  const { uid } = (await parseTokenContext(token)) ?? {}

  return uid
}

async function parseTokenContext(
  token: string,
): Promise<admin.auth.DecodedIdToken> {
  if (!token) {
    return null
  }

  const user = await auth.verifyIdToken(token as string)

  return user
}

export { parseTokenContext }
