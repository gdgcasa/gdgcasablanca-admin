interface GetRoleReturnType {
  role: UserType['role']
  isAdmin: boolean
  canEdit: boolean
}

export default function getRole(user: UserType): GetRoleReturnType {
  if (!user) {
    return { role: 'user', isAdmin: false, canEdit: false }
  }

  const isAdmin = user.role === 'admin'
  const canEdit = user.role === 'admin' || user.role === 'editor'

  return { role: user.role, isAdmin, canEdit }
}
