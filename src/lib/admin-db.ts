import { membersCollection, usersCollection } from 'src/config'
import { getItemsFromSnapshot } from 'src/utils'

import admin from './admin-firebase'

const db = admin.firestore()

async function getMembers(
  publishedOnly: boolean = true,
): Promise<Array<DbMember>> {
  let snapshot = null
  const snapbase = db.collection(membersCollection)

  if (publishedOnly) {
    snapshot = await snapbase.where('isPublic', '==', true).get()
  } else {
    snapshot = await snapbase.get()
  }

  const members = getItemsFromSnapshot<DbMember>(snapshot)

  return members
}

async function getMember(id: string): Promise<DbMember | null> {
  const doc = await db.collection(membersCollection).doc(id).get()

  if (!doc.exists) {
    return null
  }

  const memberWithoutId = doc.data() as Omit<DbMember, 'id'>

  return { id: doc.id, ...memberWithoutId }
}

async function getAdminUserRole(uid: string): Promise<UserRole> {
  const dbUser = await db.collection(usersCollection).doc(uid).get()

  if (!dbUser.exists) {
    throw new Error(`User doen't exist`)
  }

  return dbUser.get('role')
}

async function getEditorUsers(): Promise<UserType[]> {
  const editorRoles: Exclude<UserRole, 'user'>[] = ['editor', 'admin']

  const snapshot = await db
    .collection(usersCollection)
    .where('role', 'in', editorRoles)
    .get()

  const users = getItemsFromSnapshot<UserType>(snapshot)

  return users
}

async function changeMemberRole(
  uid: UserType['uid'],
  newRole: UserType['role'],
) {
  return db.collection(usersCollection).doc(uid).update({ role: newRole })
}

export {
  getMembers,
  getMember,
  getAdminUserRole,
  getEditorUsers,
  changeMemberRole,
}
