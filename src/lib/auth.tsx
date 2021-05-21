import * as React from 'react'
import Router from 'next/router'

import firebase from './firebase'
import { createUser, getUserRole } from './db'

const statuses = ['idle', 'started', 'resolved'] as const
type Status = typeof statuses[number]

type AuthContextType = {
  user: UserType
  status: Status
  loading: boolean
  signinWithEmail: (email: string, password: string) => Promise<void> | void
  signinWithGoogle: (redirect?: string) => Promise<void> | void
  signout: (redirect?: string) => Promise<void> | void
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  status: 'idle',
  loading: true,
  signinWithEmail: () => {},
  signinWithGoogle: () => {},
  signout: () => {},
})

export function AuthProvider({ children }) {
  const auth = useProvideAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)

  if (!context) {
    throw new Error(
      'Before using the `useAuth` hook, wrap your component in `AuthProvider`',
    )
  }

  return context
}

function useProvideAuth() {
  const [user, setUser] = React.useState<UserType>(null)
  const [status, setStatus] = React.useState<Status>('started')

  async function handleUser(
    rawUser,
    aditionalUserInfo?: firebase.auth.AdditionalUserInfo,
  ) {
    if (rawUser) {
      const isNewUser = Boolean(aditionalUserInfo?.isNewUser)
      const user = await formatUser(rawUser, isNewUser)
      const { token, ...userWithoutToken } = user

      if (isNewUser) {
        await createUser(userWithoutToken)
      }

      // setting httpOnly token cookie
      fetch('/api/login', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: user.token }),
      })

      setUser(user)
    } else {
      // Remove token cookie
      fetch('/api/logout', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      setUser(null)
    }
    setStatus('resolved')
  }

  const signinWithEmail = (email: string, password: string) => {
    setStatus('started')
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        handleUser(response.user, response.additionalUserInfo)
      })
  }

  const signinWithGoogle = (redirect?: string) => {
    setStatus('started')
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((response) => {
        handleUser(response.user, response.additionalUserInfo)

        if (redirect) {
          Router.push(redirect)
        }
      })
  }

  const signout = (redirect?: string) => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        handleUser(null)

        if (redirect) {
          Router.push(redirect)
        }
      })
  }

  React.useEffect(() => {
    const unsubscribe = firebase.auth().onIdTokenChanged(handleUser)

    return () => unsubscribe()
  }, [])

  return {
    user,
    status,
    loading: status === 'started',
    signinWithEmail,
    signinWithGoogle,
    signout,
  }
}

const formatUser = async (
  user: firebase.User,
  isNewUser: boolean,
): Promise<UserType> => {
  const token = await user.getIdToken()
  const role: UserRole = isNewUser ? 'user' : await getUserRole(user.uid)

  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
    role,
    token,
  }
}
