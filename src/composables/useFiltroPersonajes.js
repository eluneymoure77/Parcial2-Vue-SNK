import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

export function useFiltroPersonajes(
  personajesBase,
  { obtenerDivision, obtenerRango, porPagina = 12 } = {}
) {
  const textoBusqueda = ref('')
  const busquedaAplicada = ref('')
  const filtroRol = ref('todos') // 'todos' | 'Main' | 'Supporting'
  const filtroRango = ref('')
  const filtroDivision = ref('')
  const paginaActual = ref(1)

  const menuAbierto = ref(null) // null | 'rango' | 'division'
  const contenedorFiltros = ref(null)

  function cerrarMenusAlClickAfuera(evento) {
    if (contenedorFiltros.value && !contenedorFiltros.value.contains(evento.target)) {
      menuAbierto.value = null
    }
  }

  onMounted(() => document.addEventListener('click', cerrarMenusAlClickAfuera))
  onUnmounted(() => document.removeEventListener('click', cerrarMenusAlClickAfuera))

  function obtenerOpcionesOrdenadas(sacarValores, ignorar) {
    const set = new Set()
    for (const item of personajesBase.value) {
      const id = item?.character?.mal_id
      for (const val of sacarValores(id)) {
        const texto = val ? String(val).trim() : ''
        if (texto && texto.toLowerCase() !== ignorar) set.add(texto)
      }
    }
    return [...set].sort((a, b) => a.localeCompare(b))
  }

  const opcionesDivision = computed(() =>
    obtenerOpcionesOrdenadas((id) => obtenerDivision(id), 'division')
  )

  const opcionesRango = computed(() =>
    obtenerOpcionesOrdenadas((id) => [obtenerRango(id)], 'rank')
  )

  const personajesFiltrados = computed(() => {
    const consulta = busquedaAplicada.value.trim().toLowerCase()
    const divFiltro = filtroDivision.value.toLowerCase()
    const rngFiltro = filtroRango.value.toLowerCase()

    return personajesBase.value.filter((item) => {
      const id = item?.character?.mal_id
      const nombre = (item?.character?.name || item?.name || '').toLowerCase()
      const rol = item?.role || ''
      const divisiones = obtenerDivision(id)
      const rango = String(obtenerRango(id) || '').toLowerCase()

      return (
        (!consulta || nombre.includes(consulta)) &&
        (filtroRol.value === 'todos' || rol === filtroRol.value) &&
        (!divFiltro || divisiones.some((d) => String(d).toLowerCase() === divFiltro)) &&
        (!rngFiltro || rango === rngFiltro)
      )
    })
  })

  const totalPaginas = computed(() => {
    return Math.max(1, Math.ceil(personajesFiltrados.value.length / porPagina))
  })

  watch(
    [busquedaAplicada, filtroRol, filtroRango, filtroDivision, totalPaginas],
    () => {
      if (paginaActual.value > totalPaginas.value) {
        paginaActual.value = totalPaginas.value
      } else {
        paginaActual.value = 1
      }
    }
  )

  const personajesPaginados = computed(() => {
    const inicio = (paginaActual.value - 1) * porPagina
    return personajesFiltrados.value.slice(inicio, inicio + porPagina)
  })

  function irAPagina(numero) {
    const objetivo = Math.min(Math.max(1, Number(numero) || 1), totalPaginas.value)
    paginaActual.value = objetivo
  }

  function paginaAnterior() {
    irAPagina(paginaActual.value - 1)
  }

  function paginaSiguiente() {
    irAPagina(paginaActual.value + 1)
  }

  const resultadoUnico = computed(() => {
    const hayBusqueda = busquedaAplicada.value.trim().length > 0
    return hayBusqueda && personajesFiltrados.value.length === 1
      ? personajesFiltrados.value[0]
      : null
  })

  const nombreResultadoUnico = computed(() => {
    const raw = resultadoUnico.value?.character?.name || 'Character'
    if (!raw.includes(',')) return raw
    const [apellido, nombre] = raw.split(',').map((p) => p.trim())
    return `${nombre} ${apellido}`
  })

  function alternarMenu(menu) {
    menuAbierto.value = menuAbierto.value === menu ? null : menu
  }

  function alternarValor(filtroRef, valor) {
    filtroRef.value = filtroRef.value === valor ? '' : valor
    menuAbierto.value = null
  }

  const seleccionarRango = (valor) => alternarValor(filtroRango, valor)
  const seleccionarDivision = (valor) => alternarValor(filtroDivision, valor)
  const aplicarBusqueda = () => {
    busquedaAplicada.value = textoBusqueda.value
  }

  function limpiarFiltros() {
    textoBusqueda.value = ''
    busquedaAplicada.value = ''
    filtroRol.value = 'todos'
    filtroRango.value = ''
    filtroDivision.value = ''
    paginaActual.value = 1
    menuAbierto.value = null
  }

  return {
    textoBusqueda,
    busquedaAplicada,
    filtroRol,
    filtroRango,
    filtroDivision,
    paginaActual,
    porPagina,
    totalPaginas,
    personajesPaginados,
    menuAbierto,
    contenedorFiltros,
    opcionesDivision,
    opcionesRango,
    personajesFiltrados,
    resultadoUnico,
    nombreResultadoUnico,
    alternarMenu,
    seleccionarRango,
    seleccionarDivision,
    aplicarBusqueda,
    limpiarFiltros,
    irAPagina,
    paginaAnterior,
    paginaSiguiente,
  }
}