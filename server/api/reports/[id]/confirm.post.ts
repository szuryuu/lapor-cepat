import { getFirestoreDb } from '../../../utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400 })

  const body = await readBody(event).catch(() => ({}))

  const updateData: Record<string, any> = { status: 'PENDING' }

  if (body?.locationText && typeof body.locationText === 'string' && body.locationText.trim()) {
    updateData.locationText = body.locationText.trim()
  }

  if (body?.summaryBahasa && typeof body.summaryBahasa === 'string' && body.summaryBahasa.trim()) {
    updateData.summaryBahasa = body.summaryBahasa.trim()
  }

  const db = getFirestoreDb()
  await db.collection('reports').doc(id).update(updateData)

  return { success: true }
})
