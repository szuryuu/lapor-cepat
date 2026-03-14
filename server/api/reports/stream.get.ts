import { getFirestoreDb } from '../../utils/firebase'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')

  const db = getFirestoreDb()
  
  const unsubscribe = db.collection('reports').onSnapshot((snapshot) => {
    const reports = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((r: any) => r.status !== 'DRAFT')
    
    event.node.res.write(`data: ${JSON.stringify(reports)}\n\n`)
  })

  event.node.req.on('close', () => unsubscribe())

  return new Promise(() => {})
})
