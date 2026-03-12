import { getFirestoreDb } from '../../utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<{ status?: string; assignedTo?: string }>(event)
  const db = getFirestoreDb()

  const snapshot = await db.collection('reports')
    .where('id', '==', id)
    .limit(1)
    .get()

  if (snapshot.empty) throw createError({ statusCode: 404, message: 'Laporan tidak ditemukan' })

  const updates: Record<string, unknown> = {}
  if (body.status) updates.status = body.status
  if (body.assignedTo) updates.assignedTo = body.assignedTo
  if (body.status === 'DISPATCHED') updates.dispatchedAt = new Date().toISOString()
  if (body.status === 'VERIFIED') updates.verifiedAt = new Date().toISOString()

  await snapshot.docs[0].ref.update(updates)

  return { success: true }
})
