import { ParsedUrlQuery } from 'querystring'
import { GetServerSidePropsContext } from 'next'

import admin from '@/lib/admin-firebase'

import { parseCookie } from './parse-cookies'

const auth = admin.auth()

export default async function getUidFromTokenContext(
  context: GetServerSidePropsContext<ParsedUrlQuery>,
): Promise<string> {
  const { uid } = (await parseTokenContext(context.req.headers.cookie)) ?? {}

  return uid
}

async function parseTokenContext(
  cookie: string,
): Promise<admin.auth.DecodedIdToken> {
  if (!cookie) {
    return null
  }

  const { token } = parseCookie(cookie)

  if (!token) {
    return null
  }

  const user = await auth.verifyIdToken(token as string)

  return user
}

export { parseTokenContext }
