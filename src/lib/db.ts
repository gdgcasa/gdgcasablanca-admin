import { membersCollection, usersCollection } from 'src/config'
import { getItemsFromSnapshot, getUniqueName } from 'src/utils'

import firebase from './firebase'

const db = firebase.firestore()
const storage = firebase.storage()

async function addMember(member: Member) {
  const url = await uploadMemberPhoto(
    member.photo,
    getUniqueName(member.firstname, member.lastname),
  )

  return db
    .collection(membersCollection)
    .add({ ...member, isPublic: false, photo: url })
}

async function editMember(dbMember: DbMember) {
  let photo = dbMember.photo
  if (typeof dbMember.photo !== 'string') {
    photo = await uploadMemberPhoto(
      dbMember.photo,
      getUniqueName(dbMember.firstname, dbMember.lastname),
    )
  }

  const { id, ...member } = dbMember

  return db
    .collection(membersCollection)
    .doc(id)
    .update({ ...member, photo })
}

async function deleteMember(dbMember: DbMember): Promise<'1' | '0'> {
  try {
    await storage.refFromURL(dbMember.photo).delete()
    await db.collection(membersCollection).doc(dbMember.id).delete()
  } catch (err) {
    console.error(err)
    return '0'
  }

  return '1'
}

async function togglePublishMember(dbMember: DbMember): Promise<'1' | '0'> {
  try {
    await db
      .collection(membersCollection)
      .doc(dbMember.id)
      .update({ isPublic: !dbMember.isPublic })
  } catch (err) {
    console.error(err)
    return '0'
  }

  return '1'
}

async function uploadMemberPhoto(photo: File, name: string) {
  const photoPath = `${membersCollection}/${name}`

  let photoRef = null
  try {
    photoRef = storage.ref(photoPath)
    await photoRef.put(photo)
  } catch (error) {
    console.log(error)
    throw new Error(`Failed adding new image`)
  }

  if (!photoRef) return ''

  const phtoUrl = await photoRef.getDownloadURL()

  return phtoUrl
}

async function getUserRole(uid: string): Promise<UserRole> {
  const dbUser = await db.collection(usersCollection).doc(uid).get()

  if (!dbUser.exists) {
    throw new Error(`User doen't exist`)
  }

  return dbUser.get('role')
}

async function getUsersByEmail(email?: UserType['email']): Promise<UserType[]> {
  const nonEditorRoles: Extract<UserRole, 'user'>[] = ['user']

  let snapshot = null
  const snapbase = db
    .collection(usersCollection)
    .where('role', 'in', nonEditorRoles)

  if (email) {
    snapshot = await snapbase.where('email', '==', email).limit(1).get()
  } else {
    snapshot = await snapbase.limit(5).get()
  }

  const users = getItemsFromSnapshot<UserType>(snapshot)

  return users
}

function createUser(user: Omit<UserType, 'token'>) {
  return db.collection(usersCollection).doc(user.uid).set(user)
}

export {
  uploadMemberPhoto,
  addMember,
  editMember,
  deleteMember,
  togglePublishMember,
  getUserRole,
  getUsersByEmail,
  createUser,
}
