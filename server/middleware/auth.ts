export default defineEventHandler((event) => {
  const path = event.path || ''
  const method = event.method
  
  const isProtected = 
    (path === '/api/reports' && method === 'GET') ||
    (path.startsWith('/api/reports/stream') && method === 'GET') ||
    (path.startsWith('/api/reports/') && method === 'PATCH')

  if (isProtected) {
    const token = getCookie(event, 'bpbd_auth')
    if (token !== 'authenticated') {
      throw createError({ statusCode: 401, message: 'Unauthorized' })
    }
  }
})
