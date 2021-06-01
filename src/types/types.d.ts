type DbMember = {
  email: string
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

// This is a duplicate value, check the utils/constants file
const userRoles = ['user', 'admin', 'editor'] as const
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
