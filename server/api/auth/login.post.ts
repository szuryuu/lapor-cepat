export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  if (!body || body.pin !== config.bpbdPin) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  setCookie(event, 'bpbd_auth', 'authenticated', {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 86400,
    path: '/'
  })

  return { success: true }
})
