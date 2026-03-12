import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export function getFirestoreDb() {
  const config = useRuntimeConfig()

  if (!getApps().length) {
    initializeApp({
      credential: cert(JSON.parse(config.firebaseServiceAccount as string)),
    })
  }

  return getFirestore()
}
