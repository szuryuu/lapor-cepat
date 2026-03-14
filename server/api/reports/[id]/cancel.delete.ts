import { getFirestoreDb } from '../../../utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400 })
  
  const db = getFirestoreDb()
  await db.collection('reports').doc(id).delete()
  
  return { success: true }
})
