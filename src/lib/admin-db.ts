import { membersCollection, usersCollection } from 'src/config'

import admin from './admin-firebase'

const db = admin.firestore()

async function getMembers(): Promise<Array<DbMember>> {
  const snapshot = await db.collection(membersCollection).get()

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

async function getUsers() {
  const snapshot = await db
    .collection(usersCollection)
    .where('role', 'in', ['editor', 'admin'])
    .get()

  const users = getItemsFromSnapshot<DbMember>(snapshot)

  return users
}

function getItemsFromSnapshot<T extends { id: string }>(
  snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
) {
  const items: Array<T> = []

  if (!snapshot.empty) {
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as T)
    })
  }

  return items
}

export { getMembers, getMember, getAdminUserRole, getUsers }
