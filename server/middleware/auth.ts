export default defineEventHandler((event) => {
  const protectedPaths = ['/api/reports']
  
  const isProtectedWrite = protectedPaths.some(p => 
    event.path?.startsWith(p) && ['PATCH', 'DELETE'].includes(event.method)
  )

  if (isProtectedWrite) {
    const token = getCookie(event, 'bpbd_auth')
    if (token !== 'authenticated') {
      throw createError({ statusCode: 401, message: 'Unauthorized' })
    }
  }
})
