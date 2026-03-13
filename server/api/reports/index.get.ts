import { getFirestoreDb } from '../../utils/firebase'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const status = query.status as string

    const db = getFirestoreDb()
    
    const snapshot = await db.collection('reports').orderBy('timestamp', 'desc').get()
    let reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    if (status && status !== 'ALL') {
      reports = reports.filter((r: any) => r.status === status)
    }

    return reports
  } catch (e: any) {
    throw createError({ statusCode: 500, message: 'Gagal memuat antrean' })
  }
})
