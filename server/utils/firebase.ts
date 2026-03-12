import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export function getFirestoreDb() {
  const config = useRuntimeConfig()
  
  if (!getApps().length) {
    const serviceAccountRaw = config.firebaseServiceAccount as string
    
    if (!serviceAccountRaw) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Kredensial Firebase tidak ditemukan di .env'
      })
    }

    try {
      const serviceAccount = JSON.parse(serviceAccountRaw)
      initializeApp({ credential: cert(serviceAccount) })
    } catch (e) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Format JSON pada FIREBASE_SERVICE_ACCOUNT tidak valid'
      })
    }
  }
  
  return getFirestore()
}
