import { ref } from 'vue'

export function useGeolocation() {
  const coords = ref<{ lat: number, lng: number } | null>(null)
  const isLocked = ref(false)
  const errorMsg = ref('')

  const requestGPS = (): Promise<{ lat: number, lng: number }> => {
    return new Promise((resolve) => {
      const fallbackCoords = { lat: -6.175392, lng: 106.827153 }

      if (!import.meta.client) {
        return resolve(fallbackCoords)
      }

      if (!navigator.geolocation) {
        errorMsg.value = 'Akses diblokir sistem. Wajib gunakan HTTPS.'
        coords.value = fallbackCoords
        isLocked.value = true
        return resolve(fallbackCoords)
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          coords.value = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          isLocked.value = true
          errorMsg.value = ''
          resolve(coords.value)
        },
        () => {
          coords.value = fallbackCoords
          isLocked.value = true
          errorMsg.value = ''
          resolve(fallbackCoords)
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
      )
    })
  }

  return { requestGPS, coords, isLocked, errorMsg }
}
