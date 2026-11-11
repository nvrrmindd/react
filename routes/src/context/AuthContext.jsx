import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth, googleProvider } from '../services/firebase'

const AuthContext = createContext(null)

// Firebase error code -> message for the user
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
  // true until Firebase tells us if somebody is already logged in
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function loginWithGoogle() {
    return signInWithPopup(auth, googleProvider)
  }

  function logout() {
    return signOut(auth)
  }

  const value = { user, loading, signup, login, loginWithGoogle, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
