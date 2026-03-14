import { getFirestoreDb } from './firebase'

export async function checkRateLimit(ip: string) {
  const db = getFirestoreDb()
  const safeIp = ip.replace(/[^a-zA-Z0-9]/g, '_')
  const ref = db.collection('rate_limits').doc(safeIp)
  const now = Date.now()

  try {
    const doc = await ref.get()
    if (doc.exists) {
      const data = doc.data()
      if (data && data.expires > now) {
        if (data.count >= 3) {
          throw createError({ statusCode: 429, message: 'Terlalu banyak permintaan' })
        }
        await ref.update({ count: data.count + 1 })
      } else {
        await ref.set({ count: 1, expires: now + 60000 })
      }
    } else {
      await ref.set({ count: 1, expires: now + 60000 })
    }
  } catch (e: any) {
    if (e.statusCode === 429) throw e
  }
}
