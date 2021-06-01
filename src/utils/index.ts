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

export { getUniqueName, getItemsFromSnapshot }
