import admin from 'firebase-admin'

export function getFirestoreDb() {
  if (!admin.apps.length) {
    const config = useRuntimeConfig()
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey,
      }),
      storageBucket: config.public.firebaseStorageBucket
    })
  }
  return admin.firestore()
}

export function getFirebaseStorage() {
  if (!admin.apps.length) {
    const config = useRuntimeConfig()
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey,
      }),
      storageBucket: config.public.firebaseStorageBucket
    })
  }
  return admin.storage().bucket()
}
