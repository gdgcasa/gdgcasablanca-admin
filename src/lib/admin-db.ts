import { membersCollection } from 'src/config'

import admin from './admin-firebase'

const db = admin.firestore()

async function getMembers() {
  const snapshot = await db.collection(membersCollection).get()

  const members = getItemsFromSnapshot(snapshot)

  return members
}

function getItemsFromSnapshot(
  snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
) {
  const items = []

  if (!snapshot.empty) {
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() })
    })
  }

  return items
}

export { getMembers }
