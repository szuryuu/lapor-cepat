import { getFirestoreDb } from '../../utils/firebase'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const status = query.status as string

    const db = getFirestoreDb()
    let reportsRef: FirebaseFirestore.Query = db.collection('reports').orderBy('timestamp', 'desc')

    if (status && status !== 'ALL') {
      reportsRef = reportsRef.where('status', '==', status)
    }

    const snapshot = await reportsRef.get()
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (e: any) {
    throw createError({ statusCode: 500, message: 'Gagal memuat antrean' })
  }
})
