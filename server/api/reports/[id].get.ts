import { getFirestoreDb } from '../../utils/firebase'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, message: 'ID Laporan tidak valid' })

    const db = getFirestoreDb()

    const [reportDoc, photoDoc] = await Promise.all([
      db.collection('reports').doc(id).get(),
      db.collection('report_photos').doc(id).get(),
    ])

    if (!reportDoc.exists) {
      throw createError({ statusCode: 404, message: 'Laporan tidak ditemukan di database' })
    }

    const report = { id: reportDoc.id, ...reportDoc.data() } as any

    if (photoDoc.exists) {
      report.photoUrl = photoDoc.data()?.photoUrl ?? null
    }

    return report
  } catch (e: any) {
    throw createError({ statusCode: e.statusCode || 500, message: e.message || 'Gagal menarik data' })
  }
})
