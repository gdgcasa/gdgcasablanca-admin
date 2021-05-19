type DbMember = {
  firstname: string
  lastname: string
  occupation: string
  photo: string
  id: string
}

type Member = Omit<DbMember, 'photo', 'id'> & {
  photo: File
}
