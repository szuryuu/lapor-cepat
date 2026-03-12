import { getFirestoreDb } from '../../utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const db = getFirestoreDb()

  const snapshot = await db.collection('reports')
    .where('id', '==', id)
    .limit(1)
    .get()

  if (snapshot.empty) throw createError({ statusCode: 404, message: 'Laporan tidak ditemukan' })

  return snapshot.docs[0].data()
})
