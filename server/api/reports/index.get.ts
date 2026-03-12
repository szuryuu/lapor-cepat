import { getFirestoreDb } from '../../utils/firebase'

export default defineEventHandler(async (event) => {
  const { status } = getQuery(event)
  const db = getFirestoreDb()

  let query = db.collection('reports').orderBy('priorityScore', 'desc').limit(50) as FirebaseFirestore.Query

  if (status && status !== 'ALL') {
    query = db.collection('reports')
      .where('status', '==', status)
      .orderBy('priorityScore', 'desc')
      .limit(50)
  }

  const snapshot = await query.get()
  return snapshot.docs.map(doc => doc.data())
})
