function getUniqueName(fname: string, lname: string) {
  const lfname = fname.toLowerCase()
  const llname = lname.toLowerCase()

  const ts = new Date().getTime()

  return `${lfname}-${llname}-${ts}`
}

export { getUniqueName }
