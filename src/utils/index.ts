function getUniqueName(fname: string, lname: string) {
  const lfname = fname.toLowerCase()
  const llname = lname.toLowerCase()

  const ts = new Date().getTime()

  return `${lfname}-${llname}-${ts}`
}

function getItemsFromSnapshot<T extends { id: string } | { uid: string }>(
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

async function getEventsFromSnapshot<
  T extends { id: string } | { uid: string },
>(snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>) {
  if (!snapshot.empty) {
    const promises = []

    snapshot.forEach((doc) => {
      promises.push(
        new Promise(async (resolve, reject) => {
          const data = doc.data()

          if (data.organizers.length > 0) {
            const promises = data.organizers.map((userRef) => userRef.get())
            const reses = await Promise.all(promises)
            data.organizers = reses.map((snap) => ({
              id: snap.id,
              ...snap.data(),
            }))
          }

          resolve({ id: doc.id, ...data } as T)
        }),
      )
    })

    const items: Array<T> = await Promise.all(promises)

    return items
  }

  return []
}

export { getUniqueName, getItemsFromSnapshot, getEventsFromSnapshot }
