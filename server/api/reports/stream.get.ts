import { getFirestoreDb } from '../../utils/firebase'

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')

  const db = getFirestoreDb()
  let unsubscribe: () => void

  const stream = new ReadableStream({
    start(controller) {
      unsubscribe = db.collection('reports')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          const reports = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter((r: any) => r.status !== 'DRAFT')
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(reports)}\n\n`))
        }, (err) => {
          controller.error(err)
        })
    },
    cancel() {
      if (unsubscribe) unsubscribe()
    }
  })

  return sendStream(event, stream)
})
