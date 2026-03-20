import { ref } from 'vue'

export function useGeolocation() {
  const coords = ref<{ lat: number, lng: number } | null>(null)
  const isLocked = ref(false)
  const errorMsg = ref('')
  const isFallback = ref(false)

  const DEFAULT_COORDS = { lat: -7.782888, lng: 110.367069 }

  const getFallback = async () => {
    isFallback.value = true
    try {
      const res = await fetch('https://ip-api.com/json/?fields=status,lat,lon')
      const data = await res.json()
      if (data.status === 'success' && data.lat && data.lon) {
        return { lat: parseFloat(data.lat), lng: parseFloat(data.lon) }
      }
      return DEFAULT_COORDS
    } catch {
      return DEFAULT_COORDS
    }
  }

  const requestGPS = (): Promise<{ lat: number, lng: number }> => {
    return new Promise(async (resolve) => {
      isFallback.value = false
      if (!import.meta.client) {
        isFallback.value = true
        return resolve(DEFAULT_COORDS)
      }

      if (!navigator.geolocation) {
        const fallback = await getFallback()
        coords.value = fallback
        isLocked.value = true
        errorMsg.value = ''
        return resolve(fallback)
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          coords.value = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          isLocked.value = true
          errorMsg.value = ''
          resolve(coords.value)
        },
        async () => {
          const fallback = await getFallback()
          coords.value = fallback
          isLocked.value = true
          errorMsg.value = ''
          resolve(fallback)
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
      )
    })
  }

  return { requestGPS, coords, isLocked, errorMsg, isFallback }
}
