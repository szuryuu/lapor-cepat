import admin from 'firebase-admin'

export function getFirestoreDb() {
  if (!admin.apps.length) {
    const config = useRuntimeConfig()
    let credentialObj

    if (config.firebaseServiceAccount) {
      try {
        credentialObj = admin.credential.cert(JSON.parse(String(config.firebaseServiceAccount)))
      } catch {
        credentialObj = admin.credential.applicationDefault()
      }
    } else {
      credentialObj = admin.credential.applicationDefault()
    }

    admin.initializeApp({
      credential: credentialObj,
      projectId: config.public.firebaseProjectId,
    })
  }
  return admin.firestore()
}
