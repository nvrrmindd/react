import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '../services/firebase'
import { logAction } from '../services/logs'

function saveUser(user) {
  return setDoc(
    doc(db, 'users', user.uid),
    {
      email: user.email,
      name: user.displayName || '',
      lastLogin: serverTimestamp(),
    },
    { merge: true },
  )
}

const AuthContext = createContext(null)

const errorMessages = {
  'auth/invalid-credential': 'Wrong email or password.',
  'auth/wrong-password': 'Wrong email or password.',
  'auth/user-not-found': 'Wrong email or password.',
  'auth/invalid-email': 'This email address is not valid.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/popup-closed-by-user': 'The Google sign-in window was closed.',
}

export function getAuthErrorMessage(error) {
  return errorMessages[error.code] || 'Something went wrong. Please try again.'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function signup(email, password) {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await saveUser(result.user)
    logAction('signup')
  }

  async function login(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password)
    await saveUser(result.user)
    logAction('login')
  }

  async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider)
    await saveUser(result.user)
    logAction('login_google')
  }

  function logout() {
    logAction('logout')
    return signOut(auth)
  }

  const value = { user, loading, signup, login, loginWithGoogle, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
