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

const userRoles = ['user', 'admin', 'aditor'] as const
type UserRole = typeof userRoles[number]

type UserType = {
  uid: string
  email: string | null
  name: string | null
  provider: string
  photoUrl: string | null
  token: string
  role: UserRole
} | null
