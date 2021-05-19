type DbMember = {
  firstname: string
  id: string
  lastname: string
  occupation: string
  photo: string
  url?: string
}

type Member = Omit<DbMember, 'photo', 'id'> & {
  photo: File
}
