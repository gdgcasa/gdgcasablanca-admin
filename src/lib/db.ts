import { getUniqueName } from 'src/utils'
import firebase from './firebase'

const db = firebase.firestore()
const storage = firebase.storage()

const membersCollection = 'members'

async function addMember(member: Member) {
  const url = await uploadMemberPhoto(
    member.photo,
    getUniqueName(member.firstname, member.lastname),
  )

  return db.collection(membersCollection).add({ ...member, photo: url })
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

export { uploadMemberPhoto, addMember }