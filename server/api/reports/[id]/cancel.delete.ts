import { getFirestoreDb } from '../../../utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400 })

  const db = getFirestoreDb()

  const batch = db.batch()
  batch.delete(db.collection('reports').doc(id))
  batch.delete(db.collection('report_photos').doc(id))
  await batch.commit()

  return { success: true }
})
