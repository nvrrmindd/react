import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'

export function logAction(action, details = {}) {
  const user = auth.currentUser
  if (!user) return

  addDoc(collection(db, 'logs'), {
    uid: user.uid,
    email: user.email,
    action,
    details,
    createdAt: serverTimestamp(),
  }).catch((error) => console.error('Log was not saved:', error))
}
