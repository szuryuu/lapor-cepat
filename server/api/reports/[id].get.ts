import { getFirestoreDb } from '../../utils/firebase'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, message: 'ID Laporan tidak valid' })

    const db = getFirestoreDb()
    const doc = await db.collection('reports').doc(id).get()

    if (!doc.exists) {
      throw createError({ statusCode: 404, message: 'Laporan tidak ditemukan di database' })
    }

    return { id: doc.id, ...doc.data() }
  } catch (e: any) {
    throw createError({ statusCode: e.statusCode || 500, message: e.message || 'Gagal menarik data' })
  }
})
