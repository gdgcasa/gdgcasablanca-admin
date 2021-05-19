type DbMember = {
  firstname: string
  lastname: string
  occupation: string
  photo: string
}

type Member = Omit<DbMember, 'photo'> & {
  photo: File
}
