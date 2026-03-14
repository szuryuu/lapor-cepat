import { getFirestoreDb } from '../../utils/firebase'

const VALID_STATUSES = ['PENDING', 'DISPATCHED', 'RESOLVED']

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, message: 'ID tidak valid' })

    const body = await readBody(event)
    if (!body || !body.status || !VALID_STATUSES.includes(body.status)) {
      throw createError({ statusCode: 400, message: 'Status tidak valid' })
    }

    const db = getFirestoreDb()
    await db.collection('reports').doc(id).update({ status: body.status })

    return { success: true, id, status: body.status }
  } catch (e: any) {
    if (e.statusCode) throw e
    throw createError({ statusCode: 500, message: 'Gagal memperbarui status' })
  }
})
