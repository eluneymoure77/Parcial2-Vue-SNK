<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import SectionHeroBanner from '../components/SectionHeroBanner.vue'
import PersonajeCard from '../components/PersonajeCard.vue'
import PantallaBug from '../components/PantallaBug.vue'
import ExploreSidebar from '../components/ExploreSidebar.vue'
import { useFavoritos } from '../composables/useFavoritos.js'
import { usePersonajes } from '../composables/usePersonajes.js'
import { useSnkApi } from '../composables/useSnkApi.js'
import { useFiltroPersonajes } from '../composables/useFiltroPersonajes.js'
import { VISTAS_CONFIG } from '../data/vistasConfig.js'

defineProps({
  videoSrc: {
    type: String,
    default: '/video/banner-video.mp4',
  },
})

const { personajes, cargandoPersonajes, errorPersonajes, obtenerPersonajes } = useSnkApi()
const {
  obtenerImagen,
  obtenerDescripcion,
  obtenerDivision,
  obtenerRango,
  usarFallback,
} = usePersonajes()

const { favoritosIds, toggleFavorito } = useFavoritos()

onMounted(() => {
  obtenerPersonajes()
})

const personajesOrdenados = computed(() => {
  return [...personajes.value].sort((personajeUno, personajeDos) => {
    const esMainUno = personajeUno?.role === 'Main' ? 0 : 1
    const esMainDos = personajeDos?.role === 'Main' ? 0 : 1

    if (esMainUno !== esMainDos) return esMainUno - esMainDos

    const idUno = Number(personajeUno?.character?.mal_id)
    const idDos = Number(personajeDos?.character?.mal_id)

    if (Number.isNaN(idUno)) return 1
    if (Number.isNaN(idDos)) return -1
    return idUno - idDos
  })
})

const totalPersonajes = computed(() => personajesOrdenados.value.length)

const {
  textoBusqueda,
  busquedaAplicada,
  filtroRol,
  filtroRango,
  filtroDivision,
  paginaActual,
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
} = useFiltroPersonajes(personajesOrdenados, { obtenerDivision, obtenerRango })

</script>

<template>
  <div class="min-h-svh bg-carbon text-pergamino">
    <SectionHeroBanner variant="seccion" :video-src="videoSrc" v-bind="VISTAS_CONFIG.personajes.banner" />

    <div class="personajes-layout">
      <ExploreSidebar />

      <div class="min-w-0 flex-1">
        <!-- Encabezado de sección -->
        <header class="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="font-rubik text-2xl sm:text-3xl font-bold text-hueso">Characters</h2>
            <p class="mt-1 text-xs sm:text-sm text-pergamino/75">
              Explore their stories. Find your next favorite.
            </p>
          </div>

          <span v-if="errorPersonajes" class="personajes-pill-sin-conexion">
            Offline
          </span>
          <span v-else class="rounded-md bg-verde-pizarra px-3 py-1 text-xs sm:text-sm font-semibold text-pergamino">
            {{ totalPersonajes }} characters
          </span>
        </header>

        <!-- Buscador y filtros -->
        <section ref="contenedorFiltros" aria-label="Search and filter characters"
          class="mb-7 rounded-xl border border-pergamino/10 bg-carbon/80 p-4 sm:p-5">
          <form @submit.prevent="aplicarBusqueda" class="space-y-2">
            <label for="buscador-personaje" class="block text-xs font-medium text-pergamino/80">
              Search by name
            </label>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div class="relative min-w-0 flex-1">
                <span aria-hidden="true"
                  class="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-pergamino/60">
                  <i class="ri-search-line"></i>
                </span>
                <input id="buscador-personaje" v-model="textoBusqueda" type="search"
                  placeholder="Search a character by name" @input="busquedaAplicada = textoBusqueda"
                  class="w-full rounded-lg border border-pergamino/15 bg-black/50 py-2.5 pr-4 pl-10 text-sm text-hueso placeholder:text-pergamino/45 focus:border-lime-400 focus:outline-none" />
              </div>

              <button type="submit"
                class="w-full shrink-0 cursor-pointer rounded-lg bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300 sm:w-auto">
                Search character
              </button>
            </div>

            <p class="text-xs text-pergamino/55">
              {{
                errorPersonajes
                  ? 'You need a connection to search characters.'
                  : 'Search by name or explore the archive cards.'
              }}
            </p>
          </form>

          <!-- Fila inferior de filtros -->
          <div
            class="mt-4 flex flex-col gap-3 border-t border-pergamino/10 pt-4 md:flex-row md:items-center md:justify-between">
            <div class="flex flex-wrap items-center gap-2">
              <button type="button" @click="filtroRol = 'todos'" :class="[
                'cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold transition',
                filtroRol === 'todos'
                  ? 'bg-lime-400 text-black'
                  : 'bg-white/5 text-pergamino/80 hover:bg-white/10',
              ]">
                All
              </button>

              <button type="button" @click="filtroRol = 'Main'" :class="[
                'cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold transition',
                filtroRol === 'Main'
                  ? 'bg-lime-400 text-black'
                  : 'bg-white/5 text-pergamino/80 hover:bg-white/10',
              ]">
                Main
              </button>

              <button type="button" @click="filtroRol = 'Supporting'" :class="[
                'cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold transition',
                filtroRol === 'Supporting'
                  ? 'bg-lime-400 text-black'
                  : 'bg-white/5 text-pergamino/80 hover:bg-white/10',
              ]">
                Supporting
              </button>
            </div>

            <div class="flex flex-wrap items-center gap-2 sm:gap-3">
              <!-- Filtro de Rango -->
              <div class="relative">
                <button type="button" :aria-expanded="menuAbierto === 'rango'" @click="alternarMenu('rango')" :class="[
                  'flex min-w-[110px] cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-1.5 text-xs transition',
                  filtroRango
                    ? 'border-lime-400 bg-lime-400/15 font-semibold text-lime-300'
                    : 'border-pergamino/15 bg-black/50 text-pergamino hover:border-pergamino/30',
                ]">
                  <span>{{ filtroRango || 'Rank' }}</span>
                  <span aria-hidden="true" class="text-[10px] opacity-75">
                    <i :class="menuAbierto === 'rango' ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
                  </span>
                </button>

                <ul v-if="menuAbierto === 'rango'" role="listbox" aria-label="Rank options"
                  class="filtro-dropdown-scroll absolute top-full left-0 z-30 mt-1.5 max-h-60 w-48 overflow-y-auto rounded-lg border border-pergamino/15 bg-[#1b1c1a] py-1 shadow-xl">
                  <li v-for="rango in opcionesRango" :key="rango">
                    <button type="button" @click="seleccionarRango(rango)" :class="[
                      'flex w-full cursor-pointer items-center justify-between px-3.5 py-2 text-left text-xs transition',
                      filtroRango === rango
                        ? 'bg-lime-400/20 font-semibold text-lime-300'
                        : 'text-pergamino/85 hover:bg-white/10 hover:text-hueso',
                    ]">
                      <span>{{ rango }}</span>
                      <i v-if="filtroRango === rango" class="ri-check-line" aria-hidden="true"></i>
                    </button>
                  </li>
                </ul>
              </div>

              <!-- Filtro de Division -->
              <div class="relative">
                <button type="button" :aria-expanded="menuAbierto === 'division'" @click="alternarMenu('division')"
                  :class="[
                    'flex min-w-[125px] cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-1.5 text-xs transition',
                    filtroDivision
                      ? 'border-lime-400 bg-lime-400/15 font-semibold text-lime-300'
                      : 'border-pergamino/15 bg-black/50 text-pergamino hover:border-pergamino/30',
                  ]">
                  <span>{{ filtroDivision || 'Division' }}</span>
                  <span aria-hidden="true" class="text-[10px] opacity-75">
                    <i :class="menuAbierto === 'division' ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
                  </span>
                </button>

                <ul v-if="menuAbierto === 'division'" role="listbox" aria-label="Division options"
                  class="absolute top-full right-0 z-30 mt-1.5 max-h-60 w-52 overflow-y-auto rounded-lg border border-pergamino/15 bg-[#1b1c1a] py-1 shadow-xl sm:right-auto sm:left-0">
                  <li v-for="division in opcionesDivision" :key="division">
                    <button type="button" @click="seleccionarDivision(division)" :class="[
                      'flex w-full cursor-pointer items-center justify-between px-3.5 py-2 text-left text-xs transition',
                      filtroDivision === division
                        ? 'bg-lime-400/20 font-semibold text-lime-300'
                        : 'text-pergamino/85 hover:bg-white/10 hover:text-hueso',
                    ]">
                      <span>{{ division }}</span>
                      <i v-if="filtroDivision === division" class="ri-check-line" aria-hidden="true"></i>
                    </button>
                  </li>
                </ul>
              </div>

              <button type="button" @click="limpiarFiltros"
                class="cursor-pointer px-2 py-1.5 text-xs font-medium text-pergamino/65 transition hover:text-hueso">
                Clear filters
              </button>
            </div>
          </div>
        </section>

        <!-- Resultados -->
        <section aria-label="Character results">
          <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 class="font-rubik text-base sm:text-lg font-semibold text-hueso">
              <template v-if="errorPersonajes">
                We couldn't bring the characters
              </template>
              <template v-else>
                {{
                  busquedaAplicada.trim()
                    ? `Results for "${busquedaAplicada.trim()}"`
                    : 'All characters'
                }}
              </template>
            </h3>

            <span class="text-xs text-pergamino/65">
              <template v-if="errorPersonajes">
                Connection interrupted
              </template>
              <template v-else>
                {{
                  busquedaAplicada.trim()
                    ? `${personajesFiltrados.length} ${personajesFiltrados.length === 1 ? 'result' : 'results'}`
                    : `${personajesFiltrados.length} of ${totalPersonajes} characters`
                }}
              </template>
            </span>
          </div>

          <!-- Pantalla Error de conexión -->
          <PantallaBug v-if="errorPersonajes" v-bind="VISTAS_CONFIG.personajes.errorConexion"
            :cargando="cargandoPersonajes" @reintentar="obtenerPersonajes" />

          <!-- Cargando inicial -->
          <p v-else-if="cargandoPersonajes && personajesOrdenados.length === 0"
            class="py-10 text-center text-pergamino/80">
            Loading characters...
          </p>

          <!-- Pantalla sin coincidencias -->
          <PantallaBug v-else-if="personajesFiltrados.length === 0" v-bind="VISTAS_CONFIG.personajes.sinResultados"
            :description="busquedaAplicada.trim()
              ? `We couldn't find &quot;${busquedaAplicada.trim()}&quot; in the archive. Try another name or clear the search.`
              : 'No characters match the selected filters. Try another filter combination or clear the filters.'
              " @accion-primaria="limpiarFiltros" />

          <!-- Tarjeta de personaje destacada cuando hay 1 único resultado por búsqueda -->
          <article v-else-if="resultadoUnico" class="personaje-destacado">
            <div class="personaje-destacado-media">
              <img :src="obtenerImagen(resultadoUnico.character?.mal_id)" :alt="nombreResultadoUnico"
                @error="usarFallback" class="relative z-1 block h-full w-full object-cover object-top" />
            </div>

            <div class="personaje-destacado-cuerpo">
              <div class="space-y-2">
                <p class="text-[11px] font-bold tracking-[0.16em] uppercase text-[#8ce838]">
                  MATCH FOUND
                </p>

                <h4 class="font-rubik text-xl sm:text-2xl lg:text-[2.1rem] font-extrabold leading-tight text-hueso">
                  {{ nombreResultadoUnico }}
                </h4>

                <span
                  class="inline-block rounded-md border border-white/10 bg-[#253229] px-2.5 py-0.5 text-xs font-medium text-pergamino/90">
                  {{
                    obtenerRango(resultadoUnico.character?.mal_id) ||
                    (resultadoUnico.role === 'Main' ? 'Main' : 'Supporting')
                  }}
                </span>

                <p class="max-w-2xl text-xs sm:text-sm leading-relaxed text-pergamino/75">
                  {{
                    obtenerDescripcion(resultadoUnico.character?.mal_id) ||
                    `${nombreResultadoUnico} appears in the Attack on Titan archive.`
                  }}
                </p>
              </div>

              <div class="flex items-center gap-2.5 sm:gap-3 pt-1">
                <RouterLink :to="{
                  name: 'personaje-detalle',
                  params: { id: resultadoUnico.character?.mal_id },
                }" class="personaje-destacado-btn-principal">
                  <span>View character</span>
                  <i class="ri-arrow-right-up-line" aria-hidden="true"></i>
                </RouterLink>

                <button type="button" :aria-label="favoritosIds.includes(resultadoUnico.character?.mal_id)
                  ? 'Remove ' + nombreResultadoUnico + ' from favorites'
                  : 'Save ' + nombreResultadoUnico + ' to favorites'
                  " :aria-pressed="favoritosIds.includes(resultadoUnico.character?.mal_id)"
                  @click="toggleFavorito(resultadoUnico.character?.mal_id)" :class="[
                    'personaje-destacado-btn-secundario',
                    favoritosIds.includes(resultadoUnico.character?.mal_id)
                      ? 'personaje-destacado-btn-secundario--activo'
                      : '',
                  ]">
                  <span aria-hidden="true">
                    {{ favoritosIds.includes(resultadoUnico.character?.mal_id) ? '♥' : '♡' }}
                  </span>
                  <i :class="favoritosIds.includes(resultadoUnico.character?.mal_id)
                      ? 'ri-heart-fill'
                      : 'ri-heart-line'
                    " aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </article>

          <!-- Grilla de personajes cuando hay más de 1 resultado -->
          <div v-else>
            <div class="personajes-grid">
              <PersonajeCard v-for="(item, index) in personajesPaginados" :key="item.character?.mal_id ?? index"
                :item="item" :imagen-src="obtenerImagen(item.character?.mal_id)"
                :descripcion="obtenerDescripcion(item.character?.mal_id)"
                :es-favorito="favoritosIds.includes(item.character?.mal_id)" @toggle-favorito="toggleFavorito"
                @error-imagen="usarFallback" />
            </div>

            <!-- Controles de paginación -->
            <nav v-if="totalPaginas > 1" aria-label="Character pagination"
              class="mt-8 flex items-center justify-center gap-1.5 sm:flex-wrap sm:gap-2">
              <button type="button" :disabled="paginaActual <= 1" @click="paginaAnterior"
                class="cursor-pointer rounded-lg border border-pergamino/15 bg-black/50 px-3 py-2 text-xs font-semibold text-pergamino transition hover:border-lime-400 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3.5">
                Prev
              </button>
              <span class="px-2.5 text-xs font-semibold text-pergamino/85 sm:hidden">
                {{ paginaActual }} / {{ totalPaginas }}
              </span>

              <div class="hidden items-center gap-2 sm:flex">
                <button v-for="num in totalPaginas" :key="num" type="button"
                  :aria-current="paginaActual === num ? 'page' : undefined" @click="irAPagina(num)" :class="[
                    'cursor-pointer rounded-lg px-3.5 py-2 text-xs font-bold transition',
                    paginaActual === num
                      ? 'bg-lime-400 text-black'
                      : 'border border-pergamino/15 bg-black/50 text-pergamino/80 hover:bg-white/10',
                  ]">
                  {{ num }}
                </button>
              </div>

              <button type="button" :disabled="paginaActual >= totalPaginas" @click="paginaSiguiente"
                class="cursor-pointer rounded-lg border border-pergamino/15 bg-black/50 px-3 py-2 text-xs font-semibold text-pergamino transition hover:border-lime-400 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3.5">
                Next
              </button>
            </nav>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>