export function useGeolocation() {
  const lat = ref<number | null>(null)
  const lng = ref<number | null>(null)
  const accuracy = ref<number | null>(null)
  const error = ref<string | null>(null)
  const isLoading = ref(false)

  function capture(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        error.value = 'Geolocation tidak didukung browser ini.'
        reject(new Error(error.value))
        return
      }

      isLoading.value = true

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          lat.value = pos.coords.latitude
          lng.value = pos.coords.longitude
          accuracy.value = pos.coords.accuracy
          isLoading.value = false
          resolve({ lat: lat.value, lng: lng.value })
        },
        (err) => {
          error.value = 'GPS tidak tersedia. Lokasi diambil dari transkrip.'
          isLoading.value = false
          reject(err)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    })
  }

  return { lat, lng, accuracy, error, isLoading, capture }
}
