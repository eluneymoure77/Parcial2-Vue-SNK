import { ref, watch } from 'vue'

const CLAVE_STORAGE = 'snk_favoritos_ids'

function cargarFavoritosIniciales() {
  try {
    const raw = localStorage.getItem(CLAVE_STORAGE)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.map(Number).filter(Boolean) : []
  } catch {
    return []
  }
}

const favoritosIds = ref(cargarFavoritosIniciales())

watch(
  favoritosIds,
  (nuevosIds) => {
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(nuevosIds))
    } catch {
    }
  },
  { deep: true }
)

export function useFavoritos() {
  function esFavorito(id) {
    if (id === undefined || id === null) return false
    return favoritosIds.value.includes(Number(id))
  }

  function quitarFavorito(id) {
    const idNum = Number(id)
    favoritosIds.value = favoritosIds.value.filter((itemId) => Number(itemId) !== idNum)
  }

  function toggleFavorito(id) {
    if (id === undefined || id === null) return false
    const idNum = Number(id)

    if (esFavorito(idNum)) {
      quitarFavorito(idNum)
      return false
    }

    favoritosIds.value = [...favoritosIds.value, idNum]
    return true
  }

  function vaciarFavoritos() {
    favoritosIds.value = []
  }

  return {
    favoritosIds,
    esFavorito,
    toggleFavorito,
    quitarFavorito,
    vaciarFavoritos,
  }
}