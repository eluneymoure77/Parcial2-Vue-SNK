import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { divisions } from '../data/divisions.js'
import { usarAudio } from './usarAudio.js'

const ESTILO_BASE = {
  codigoBranch: '01',
  iconoDivision: 'ri-shield-line',
  iconoValores: 'ri-award-line',
  acentoBorde: 'border-pergamino/25',
  badgeEstilo: 'border-pergamino/20 bg-white/5 text-hueso',
}

export function useDivisiones() {

  // DivisionesView y listados

  const listaDivisiones = ref(divisions)
  const totalDivisiones = computed(() => listaDivisiones.value.length)

  function obtenerDescripcionCorta(division) {
    return division?.descripcionTarjeta || division?.descripcion || ''
  }

  function ocultarSiFalla(event) {
    event.target.style.display = 'none'
  }


  // Logica carrusel de SectionDivisiones

  const indiceActual = ref(0)

  const divisionActiva = computed(() => {
    const actual = listaDivisiones.value[indiceActual.value]
    return {
      ...actual,
      descripcion: obtenerDescripcionCorta(actual),
      integrantes: actual.integrantes || [],
    }
  })

  function seleccionarDivision(index) {
    indiceActual.value = index
  }

  function siguienteDivision() {
    indiceActual.value = (indiceActual.value + 1) % listaDivisiones.value.length
  }

  function anteriorDivision() {
    indiceActual.value =
      (indiceActual.value - 1 + listaDivisiones.value.length) % listaDivisiones.value.length
  }

  function irAQuiz() {
    const destino = document.getElementById('section-quiz')
    if (destino) {
      destino.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Deslizar en mobile / tablet
  let touchInicioX = 0
  let touchInicioY = 0
  let toqueEnScrollMiembros = false

  function manejarTouchStart(evento) {
    if (window.innerWidth > 1024 || !evento.touches?.length) return

    toqueEnScrollMiembros = Boolean(evento.target.closest('.lista-miembros-scroll'))
    touchInicioX = evento.touches[0].clientX
    touchInicioY = evento.touches[0].clientY
  }

  function manejarTouchEnd(evento) {
    if (window.innerWidth > 1024 || toqueEnScrollMiembros || !evento.changedTouches?.length) return

    const touchFinX = evento.changedTouches[0].clientX
    const touchFinY = evento.changedTouches[0].clientY

    const deltaX = touchFinX - touchInicioX
    const deltaY = touchFinY - touchInicioY

    if (Math.abs(deltaX) < 60 || Math.abs(deltaX) <= Math.abs(deltaY)) return

    if (deltaX < 0) {
      siguienteDivision()
    } else {
      anteriorDivision()
    }
  }

  
  // Logica de DivisionDetalleView

  const route = useRoute()
  const errorBannerImg = ref(false)

  const divisionDetalle = computed(() => {
    const idActual = String(route?.params?.id || '')
    return listaDivisiones.value.find((item) => item.id === idActual) || listaDivisiones.value[0]
  })

  watch(
    () => route?.params?.id,
    () => {
      errorBannerImg.value = false
    },
  )

  const imagenBannerActual = computed(() => {
    if (errorBannerImg.value) return ''
    return divisionDetalle.value?.imgBannerViewDivision || ''
  })

  const valoresLista = computed(() => {
    const raw = divisionDetalle.value?.valores
    if (!raw) return []
    return Array.isArray(raw) ? raw : String(raw).trim().split(/\s+/).filter(Boolean)
  })

  const detalleVisual = computed(() => ({
    ...ESTILO_BASE,
    ...(divisionDetalle.value?.estiloDetalle || {}),
  }))

  return {
    // General
    divisions: listaDivisiones,
    totalDivisiones,
    obtenerDescripcionCorta,
    ocultarSiFalla,

    // Carrusel (SectionDivisiones)
    indiceActual,
    divisionActiva,
    seleccionarDivision,
    siguienteDivision,
    anteriorDivision,
    irAQuiz,
    manejarTouchStart,
    manejarTouchEnd,

    // Detalle (DivisionDetalleView)
    divisionDetalle,
    imagenBannerActual,
    valoresLista,
    detalleVisual,
  }
}

// Composable específico para el estado interno de cada TarjetaDivision
export function useTarjetaDivision(divisionProp) {
  const route = useRoute()
  const { detenerMusica } = usarAudio()
  const vistaActual = ref('principal')

  const obtenerDivisionActual = () =>
    typeof divisionProp === 'function' ? divisionProp() : divisionProp.value

  const fondoTarjetaActual = computed(() => {
    const div = obtenerDivisionActual()
    return vistaActual.value === 'principal'
      ? div?.imgFondoTarjetaDefault
      : div?.imgFondoTarjetaMiembros
  })

  watch(
    () => obtenerDivisionActual()?.id,
    () => {
      vistaActual.value = 'principal'
      detenerMusica()
    },
  )
  watch(
    () => route.fullPath,
    () => {
      detenerMusica()
    },
  )

  return {
    vistaActual,
    fondoTarjetaActual,
  }
}