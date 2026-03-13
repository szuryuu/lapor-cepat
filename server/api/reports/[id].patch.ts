import { getFirestoreDb } from '../../utils/firebase'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, message: 'ID tidak valid' })

    const body = await readBody(event)
    if (!body || !body.status) throw createError({ statusCode: 400, message: 'Status wajib diisi' })

    const db = getFirestoreDb()
    await db.collection('reports').doc(id).update({ status: body.status })

    return { success: true, id, status: body.status }
  } catch (e: any) {
    throw createError({ statusCode: 500, message: 'Gagal memperbarui status' })
  }
})
