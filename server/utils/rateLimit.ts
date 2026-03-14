const rateLimitMap = new Map<string, { count: number, expires: number }>()

export function checkRateLimit(ip: string) {
  const now = Date.now()
  const userRate = rateLimitMap.get(ip)

  if (userRate && userRate.expires > now) {
    if (userRate.count >= 3) {
      throw createError({ statusCode: 429, message: 'Terlalu banyak permintaan. Coba lagi nanti.' })
    }
    userRate.count++
  } else {
    rateLimitMap.set(ip, { count: 1, expires: now + 60000 })
  }
}
