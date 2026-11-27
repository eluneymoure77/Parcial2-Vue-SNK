import { ref } from 'vue'

const API_BASE = 'https://api.tenrai.org/v1'
const ANIME_ID_DEFAULT = 16498
const MANGA_ID_DEFAULT = 23390

const animeInfo = ref(null)
const mangaInfo = ref(null)
const mangaMoreInfo = ref('')
const personajes = ref([])
const cargandoAnime = ref(false)
const cargandoManga = ref(false)
const cargandoPersonajes = ref(false)
const errorAnime = ref('')
const errorManga = ref('')
const errorPersonajes = ref('')
const personajeDetalle = ref(null)
const cargandoDetalle = ref(false)
const errorDetalle = ref('')
const personajeInfiltrado = ref(false)

let promiseAnime = null
let promiseManga = null
let promiseMangaMoreInfo = null
let promisePersonajes = null


async function obtenerAnime(animeId = ANIME_ID_DEFAULT) {
  if (animeInfo.value) return animeInfo.value
  if (promiseAnime) return promiseAnime

  cargandoAnime.value = true
  errorAnime.value = ''

  promiseAnime = (async () => {
    try {
      const res = await fetch(`${API_BASE}/anime/${animeId}`)
      if (!res.ok) throw new Error('No se pudo cargar la información del anime.')

      const json = await res.json()
      animeInfo.value = json?.data ?? json
      return animeInfo.value
    } catch (err) {
      errorAnime.value = err?.message || 'Error al consultar la API del anime.'
      return null
    } finally {
      cargandoAnime.value = false
      promiseAnime = null
    }
  })()

  return promiseAnime
}

async function obtenerManga(mangaId = MANGA_ID_DEFAULT) {
  if (mangaInfo.value) return mangaInfo.value
  if (promiseManga) return promiseManga

  cargandoManga.value = true
  errorManga.value = ''

  promiseManga = (async () => {
    try {
      const res = await fetch(`${API_BASE}/manga/${mangaId}`)
      if (!res.ok) throw new Error('No se pudo cargar la información del manga.')

      const json = await res.json()
      mangaInfo.value = json?.data ?? json
      return mangaInfo.value
    } catch (err) {
      errorManga.value = err?.message || 'Error al consultar la API del manga.'
      return null
    } finally {
      cargandoManga.value = false
      promiseManga = null
    }
  })()

  return promiseManga
}

async function obtenerMangaMoreInfo(mangaId = MANGA_ID_DEFAULT) {
  if (mangaMoreInfo.value) return mangaMoreInfo.value
  if (promiseMangaMoreInfo) return promiseMangaMoreInfo

  promiseMangaMoreInfo = (async () => {
    try {
      const res = await fetch(`${API_BASE}/manga/${mangaId}/moreinfo`)
      if (!res.ok) return ''

      const json = await res.json()
      const texto =
        typeof json?.data === 'string'
          ? json.data
          : json?.data?.moreinfo ?? ''
      mangaMoreInfo.value = texto
      return mangaMoreInfo.value
    } catch {
      return ''
    } finally {
      promiseMangaMoreInfo = null
    }
  })()

  return promiseMangaMoreInfo
}

async function obtenerPersonajes(animeId = ANIME_ID_DEFAULT) {
  if (personajes.value.length > 0) return personajes.value
  if (promisePersonajes) return promisePersonajes

  cargandoPersonajes.value = true
  errorPersonajes.value = ''

  promisePersonajes = (async () => {
    try {
      const res = await fetch(`${API_BASE}/anime/${animeId}/characters`)
      if (!res.ok) throw new Error('No se pudieron cargar los personajes.')

      const json = await res.json()
      const lista = Array.isArray(json?.data) ? json.data : []
      personajes.value = lista
      return personajes.value
    } catch (err) {
      errorPersonajes.value = err?.message || 'Error al consultar los personajes.'
      return []
    } finally {
      cargandoPersonajes.value = false
      promisePersonajes = null
    }
  })()

  return promisePersonajes
}

async function obtenerPersonajeDetalle(characterId, animeId = ANIME_ID_DEFAULT) {
  cargandoDetalle.value = true
  errorDetalle.value = ''
  personajeInfiltrado.value = false
  personajeDetalle.value = null

  const idNum = Number(characterId)
  if (!characterId || Number.isNaN(idNum) || idNum <= 0) {
    personajeInfiltrado.value = true
    cargandoDetalle.value = false
    return null
  }

  try {
    let dataExtra = null

    try {
      const resDetalle = await fetch(`${API_BASE}/characters/${idNum}`)

      if (resDetalle.status === 404) {
        personajeInfiltrado.value = true
        return null
      }

      if (!resDetalle.ok) {
        throw new Error(`Error ${resDetalle.status} al consultar el detalle del personaje.`)
      }

      const jsonDetalle = await resDetalle.json()
      dataExtra = jsonDetalle?.data ?? jsonDetalle ?? null
    } catch (errDetalle) {
      errorDetalle.value =
        errDetalle?.message || 'Error al cargar el detalle del personaje.'
      return null
    }

    const listaBase = await obtenerPersonajes(animeId)
    const itemEnLista = listaBase.find(
      (item) => Number(item?.character?.mal_id) === idNum
    )

    if (!itemEnLista) {
      personajeInfiltrado.value = true
      return null
    }

    personajeDetalle.value = {
      ...itemEnLista,
      detalleApi: dataExtra,
      mal_id: idNum,
    }

    return personajeDetalle.value
  } catch (err) {
    errorDetalle.value = err?.message || 'Error al cargar el detalle del personaje.'
    return null
  } finally {
    cargandoDetalle.value = false
  }
}

async function cargarTodoSnk(animeId = ANIME_ID_DEFAULT) {
  return Promise.all([obtenerAnime(animeId), obtenerPersonajes(animeId)])
}

export function useSnkApi() {
  return {
    animeInfo,
    mangaInfo,
    mangaMoreInfo,
    personajes,
    personajeDetalle, 
    personajeInfiltrado,
    cargandoAnime,
    cargandoManga,
    cargandoPersonajes,
    cargandoDetalle, 
    errorAnime,
    errorManga,
    errorPersonajes,
    errorDetalle, 
    obtenerAnime,
    obtenerManga,
    obtenerMangaMoreInfo,
    obtenerPersonajes,
    obtenerPersonajeDetalle,
    cargarTodoSnk,
  }
}
