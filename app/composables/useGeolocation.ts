import { ref } from 'vue'

export function useGeolocation() {
  const coords = ref<{ lat: number, lng: number } | null>(null)
  const isLocked = ref(false)
  const errorMsg = ref('')

  const getFallback = async () => {
    try {
      const res = await fetch('https://ipwho.is/')
      const data = await res.json()
      if (data.success && data.latitude && data.longitude) {
        return { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) }
      }
      return { lat: -7.782888, lng: 110.367069 }
    } catch {
      return { lat: -7.782888, lng: 110.367069 }
    }
  }

  const requestGPS = (): Promise<{ lat: number, lng: number }> => {
    return new Promise(async (resolve) => {
      if (!import.meta.client) {
        return resolve({ lat: -7.782888, lng: 110.367069 })
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

  return { requestGPS, coords, isLocked, errorMsg }
}
