import { ref, onMounted } from 'vue'

const FALLBACK_IMG = '/img/personajes/fallback.png'

function normalizarDivisiones(valor) {
  if (Array.isArray(valor)) {
    return valor
      .map((item) => String(item || '').trim())
      .filter(Boolean)
  }

  if (typeof valor === 'string' && valor.trim()) {
    return [valor.trim()]
  }

  return []
}

export function usePersonajes() {
  const personajesPorId = ref({})
  const cargando = ref(true)

  onMounted(async () => {
    try {
      const resp = await fetch('/data/personajes.json')
      const data = await resp.json()
      const lista = Array.isArray(data) ? data : data.personajes || []

      const guardados = {}
      for (const item of lista) {
        const idNum = Number(item.id)
        if (Number.isNaN(idNum)) continue

        guardados[idNum] = {
          imagen: item.imagen || FALLBACK_IMG,
          descripcion: item.about || item.descripcion || '',
          division: normalizarDivisiones(item.division ?? item.affiliation),
          rango: item.rango || item.rank || '',
        }
      }

      personajesPorId.value = guardados
    } catch (error) {
      console.error('Error al cargar personajes.json:', error)
    } finally {
      cargando.value = false
    }
  })

  function obtenerImagen(id) {
    return personajesPorId.value[Number(id)]?.imagen || FALLBACK_IMG
  }

  function obtenerDescripcion(id) {
    return personajesPorId.value[Number(id)]?.descripcion || ''
  }

  function obtenerDivision(id) {
    const divisiones = personajesPorId.value[Number(id)]?.division
    return Array.isArray(divisiones) ? divisiones : []
  }

  function obtenerRango(id) {
    return personajesPorId.value[Number(id)]?.rango || ''
  }

  function usarFallback(event) {
    if (event.target.dataset.fallbackDone) return
    event.target.dataset.fallbackDone = 'true'
    event.target.src = FALLBACK_IMG
  }

  return {
    cargando,
    personajesPorId,
    obtenerImagen,
    obtenerDescripcion,
    obtenerDivision,
    obtenerRango,
    usarFallback,
  }
}