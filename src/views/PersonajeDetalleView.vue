<script setup>
import { computed, onMounted, watch, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import SectionHeroBanner from '../components/SectionHeroBanner.vue'
import ExploreSidebar from '../components/ExploreSidebar.vue'
import PantallaBug from '../components/PantallaBug.vue'
import { useSnkApi } from '../composables/useSnkApi.js'
import { usePersonajes } from '../composables/usePersonajes.js'
import { useFavoritos } from '../composables/useFavoritos.js'
import { VISTAS_CONFIG } from '../data/vistasConfig.js'

defineProps({
  videoSrc: {
    type: String,
    default: '/video/banner-video.mp4',
  },
})

const route = useRoute()
const personajeId = computed(() => Number(route.params.id))
const spoilerAbierto = ref(false)

const {
  personajeDetalle,
  cargandoDetalle,
  errorDetalle,
  personajeInfiltrado,
  obtenerPersonajeDetalle,
} = useSnkApi()

const {
  obtenerImagen,
  obtenerDescripcion,
  obtenerDivision,
  obtenerRango,
  usarFallback,
} = usePersonajes()

const { favoritosIds, toggleFavorito } = useFavoritos()

const infoExtraApi = computed(() => personajeDetalle.value?.detalleApi || null)
const rolPersonaje = computed(() => personajeDetalle.value?.role || '')
const rangoPersonaje = computed(() => obtenerRango(personajeId.value))
const divisionesPersonaje = computed(() => obtenerDivision(personajeId.value))
const descripcionLocal = computed(() => obtenerDescripcion(personajeId.value))
const esFavorito = computed(() => favoritosIds.value.includes(personajeId.value))

const nombreFormateado = computed(() => {
  const raw =
    infoExtraApi.value?.name ||
    personajeDetalle.value?.character?.name ||
    personajeDetalle.value?.name ||
    'Unknown Recruit'

  if (!raw.includes(',')) return raw
  const [apellido, nombre] = raw.split(',').map((p) => p.trim())
  return `${nombre} ${apellido}`
})

const imagenPersonaje = computed(() => {
  return (
    obtenerImagen(personajeId.value) ||
    infoExtraApi.value?.images?.webp?.image_url ||
    infoExtraApi.value?.images?.jpg?.image_url ||
    personajeDetalle.value?.character?.images?.webp?.image_url ||
    personajeDetalle.value?.character?.images?.jpg?.image_url ||
    '/img/personajes/fallback.png'
  )
})

const ICONOS_FICHA = [
  { match: ['age'], icon: 'ri-hourglass-line' },
  { match: ['birth'], icon: 'ri-cake-2-line' },
  { match: ['height'], icon: 'ri-ruler-line' },
  { match: ['weight'], icon: 'ri-scales-3-line' },
  { match: ['affiliation'], icon: 'ri-shield-line' },
  { match: ['rank', 'graduation'], icon: 'ri-medal-line' },
  { match: ['favorite'], icon: 'ri-heart-fill' },
]

function obtenerIconoFicha(etiqueta) {
  const clave = etiqueta.toLowerCase()
  return (
    ICONOS_FICHA.find((item) => item.match.some((k) => clave.includes(k)))?.icon ||
    'ri-pushpin-line'
  )
}

const FICHA_REGEX =
  /^(age|birthdate|birthday|height|weight|affiliations?|graduation\s*rank|rank)\s*:\s*(.+)$/i

const dossierParseado = computed(() => {
  const fichas = []
  const favs = infoExtraApi.value?.favorites

  if (favs !== undefined && favs !== null) {
    fichas.push({
      label: 'Archive Favorites',
      value: Number(favs).toLocaleString(),
      icon: 'ri-heart-fill',
      destacada: true,
    })
  }

  const rawAbout = infoExtraApi.value?.about || ''
  const parrafos = []

  for (const lineaCruda of rawAbout.split(/\r?\n/)) {
    const linea = lineaCruda.trim()
    if (!linea) continue

    const match = linea.match(FICHA_REGEX)
    if (match) {
      const label = match[1].replace(/\s+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      const value = match[2]
        .replace(/\[\/?spoiler\]/gi, '')
        .replace(/\s+,/g, ',')
        .replace(/,\s*$/g, '')
        .trim()

      if (value) {
        fichas.push({
          label,
          value,
          icon: obtenerIconoFicha(label),
          destacada: false,
        })
      }
    } else {
      parrafos.push(linea)
    }
  }

  return { fichas, parrafosBiografia: parrafos }
})

const seccionBiografiaOrdenada = computed(() => {
  const normal = []
  const notes = []
  const spoilers = []

  for (const p of dossierParseado.value.parrafosBiografia) {
    const limpio = p.replace(/\[\/?spoiler\]/gi, '').trim()
    if (!limpio) continue

    if (/^\(?\s*spoiler\s*:/i.test(p) || /\[spoiler\]/i.test(p)) {
      spoilers.push(limpio.replace(/^\(?\s*spoiler\s*:\s*/i, '').replace(/\)\s*$/, '').trim())
    } else if (/^\(?\s*notes?\s*:/i.test(p)) {
      notes.push(limpio.replace(/^\(?\s*notes?\s*:\s*/i, '').replace(/\)\s*$/, '').trim())
    } else {
      normal.push(limpio)
    }
  }

  return { normal, notes, spoilers }
})

onMounted(() => obtenerPersonajeDetalle(route.params.id))

watch(
  () => route.params.id,
  (nuevoId) => {
    spoilerAbierto.value = false
    obtenerPersonajeDetalle(nuevoId)
  }
)
</script>

<template>
  <div class="min-h-svh bg-carbon text-pergamino">
    <SectionHeroBanner variant="seccion" :video-src="videoSrc" v-bind="VISTAS_CONFIG.personajeDetalle.banner"
      :title="nombreFormateado.toUpperCase()" />

    <div class="personajes-layout">
      <ExploreSidebar />

      <div class="min-w-0 flex-1">
        <!-- Barra superior -->
        <header class="mb-5 flex flex-wrap items-center justify-between gap-3">
          <RouterLink :to="{ name: 'personajes' }"
            class="inline-flex items-center gap-2 rounded-lg border border-pergamino/15 bg-[#171a18] px-3.5 py-2 text-xs font-semibold text-pergamino transition duration-200 hover:-translate-y-0.5 hover:border-lime-400 hover:text-lime-300">
            <i class="ri-arrow-left-line text-sm" aria-hidden="true"></i>
            <span>Back to characters</span>
          </RouterLink>

          <span
            class="rounded-md border border-pergamino/10 bg-[#171a18] px-3 py-1 font-mono text-[11px] text-pergamino/70 transition hover:border-lime-400/50">
            FILE #{{ personajeId || '—' }}
          </span>
        </header>

        <!-- Cargando -->
        <div v-if="cargandoDetalle"
          class="rounded-2xl border border-pergamino/10 bg-[#141715]/95 p-10 text-center text-sm text-pergamino/80">
          Retrieving character dossier from the archive...
        </div>

        <!-- Pantalla de Error de API -->
        <PantallaBug v-else-if="errorDetalle" v-bind="VISTAS_CONFIG.personajeDetalle.errorConexion"
          :cargando="cargandoDetalle" @reintentar="obtenerPersonajeDetalle(route.params.id)" />

        <!-- Pantalla Personaje infiltrado -->
        <PantallaBug v-else-if="personajeInfiltrado" v-bind="VISTAS_CONFIG.personajeDetalle.infiltrado" />

        <!-- Ficha completa del personaje -->
        <article v-else-if="personajeDetalle"
          class="overflow-hidden rounded-2xl border border-pergamino/12 bg-gradient-to-b from-[#171b18] to-[#121513] shadow-2xl">
          <!-- Encabezado principal -->
          <div class="grid gap-6 p-5 sm:p-7 lg:grid-cols-[270px_1fr] lg:gap-8 items-start">
            <div
              class="group relative mx-auto w-full max-w-[270px] overflow-hidden rounded-xl border border-verde-claro/35 bg-bosque-oscuro shadow-lg transition duration-300 hover:-translate-y-1 hover:border-lima-acento/60 hover:shadow-xl">
              <div
                class="detalle-personaje-media-bg relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden">
                <img :src="imagenPersonaje" :alt="nombreFormateado" @error="usarFallback"
                  class="relative z-1 h-full w-full object-cover object-top transition duration-500 group-hover:scale-105" />
              </div>

              <div v-if="infoExtraApi?.favorites !== undefined"
                class="flex items-center justify-between border-t border-verde-pizarra bg-[#141815]/95 px-3.5 py-2.5 text-xs">
                <span class="text-[11px] font-semibold uppercase tracking-wider text-pergamino/65">
                  Archive Favorites
                </span>
                <span class="inline-flex items-center gap-1 font-rubik font-bold text-lima-acento">
                  <i class="ri-heart-fill" aria-hidden="true"></i>
                  {{ Number(infoExtraApi.favorites).toLocaleString() }}
                </span>
              </div>
            </div>

            <div class="min-w-0 space-y-5">
              <div class="flex flex-wrap items-center gap-2">
                <span v-if="rolPersonaje"
                  class="rounded-md border border-lime-400/40 bg-lime-400/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-lime-300 transition duration-200 hover:-translate-y-0.5 hover:bg-lime-400/25">
                  {{ rolPersonaje }}
                </span>

                <span v-if="rangoPersonaje"
                  class="rounded-md border border-pergamino/15 bg-[#222c25] px-2.5 py-1 text-xs font-semibold text-pergamino transition duration-200 hover:-translate-y-0.5 hover:border-lime-400/40">
                  Rank: {{ rangoPersonaje }}
                </span>

                <span v-for="div in divisionesPersonaje" :key="div"
                  class="rounded-md border border-pergamino/12 bg-white/5 px-2.5 py-1 text-xs font-medium text-pergamino/85 transition duration-200 hover:-translate-y-0.5 hover:border-pergamino/30 hover:bg-white/10">
                  {{ div }}
                </span>
              </div>

              <div>
                <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-lime-400/80">
                  Scout Record
                </p>
                <h2 class="mt-1 font-rubik text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-hueso">
                  {{ nombreFormateado }}
                </h2>
              </div>

              <p v-if="descripcionLocal"
                class="rounded-xl border border-pergamino/10 bg-black/30 p-4 text-xs sm:text-sm leading-relaxed text-pergamino/85 transition duration-200 hover:border-pergamino/25 hover:bg-black/40">
                {{ descripcionLocal }}
              </p>

              <div class="flex flex-wrap items-center gap-3 pt-1">
                <button type="button" :aria-label="esFavorito
                  ? 'Remove ' + nombreFormateado + ' from favorites'
                  : 'Save ' + nombreFormateado + ' to favorites'
                  " :aria-pressed="esFavorito" @click="toggleFavorito(personajeId)" :class="[
                    'inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-xs sm:text-sm font-bold transition duration-200 hover:-translate-y-0.5',
                    esFavorito
                      ? 'border border-lime-400/50 bg-lime-400/15 text-lime-300 hover:bg-lime-400/25'
                      : 'bg-lime-400 text-black hover:bg-lime-300',
                  ]">
                  <i :class="esFavorito ? 'ri-heart-fill' : 'ri-heart-line'" aria-hidden="true"></i>
                  <span>{{ esFavorito ? 'Saved in favorites' : 'Save to favorites' }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Tarjetas datos técnicos -->
          <section v-if="dossierParseado.fichas.length" aria-label="Dossier attributes"
            class="border-t border-pergamino/10 bg-black/25 px-5 py-6 sm:px-7">
            <div class="mb-4 flex items-center justify-between gap-2">
              <h3 class="font-rubik text-sm sm:text-base font-bold uppercase tracking-wider text-hueso">
                Dossier Attributes
              </h3>
              <span class="text-[11px] text-pergamino/50">
                Archive specifications
              </span>
            </div>

            <div class="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              <div v-for="ficha in dossierParseado.fichas" :key="ficha.label" :class="[
                'group flex items-start gap-3.5 rounded-xl border p-4 transition duration-200 hover:-translate-y-1 hover:shadow-lg',
                ficha.destacada
                  ? 'border-lime-400/30 bg-lime-400/10 hover:border-lime-400/60 hover:bg-lime-400/15'
                  : 'border-pergamino/10 bg-[#151916] hover:border-lime-400/40 hover:bg-[#191f1b]',
              ]">
                <span aria-hidden="true"
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-pergamino/12 bg-black/40 text-base transition duration-200 group-hover:scale-110 group-hover:border-lime-400/50 group-hover:text-lime-300">
                  <i :class="ficha.icon"></i>
                </span>

                <div class="min-w-0">
                  <p
                    class="text-[10px] font-bold uppercase tracking-[0.16em] text-pergamino/55 transition group-hover:text-lime-300/85">
                    {{ ficha.label }}
                  </p>
                  <p class="mt-1 text-xs sm:text-sm font-semibold leading-snug text-hueso">
                    {{ ficha.value }}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Biografía -->
          <section v-if="
            seccionBiografiaOrdenada.normal.length ||
            seccionBiografiaOrdenada.notes.length ||
            seccionBiografiaOrdenada.spoilers.length
          " aria-label="Biography" class="border-t border-pergamino/10 px-5 py-6 sm:px-7">
            <div class="mb-3.5 flex items-center gap-2">
              <span aria-hidden="true" class="text-base text-lime-400">
                <i class="ri-scroll-line"></i>
              </span>
              <h3 class="font-rubik text-sm sm:text-base font-bold uppercase tracking-wider text-hueso">
                Biography
              </h3>
            </div>

            <div class="space-y-4">
              <div v-if="seccionBiografiaOrdenada.normal.length"
                class="rounded-xl border border-pergamino/10 bg-black/25 p-4 sm:p-5 transition duration-200 hover:-translate-y-0.5 hover:border-pergamino/25 hover:bg-black/35">
                <div class="space-y-3">
                  <p v-for="(parrafo, idx) in seccionBiografiaOrdenada.normal" :key="`normal-${idx}`" :class="[
                    'whitespace-pre-line text-xs sm:text-sm leading-relaxed text-pergamino/80',
                    idx > 0 ? 'border-t border-pergamino/10 pt-3' : '',
                  ]">
                    {{ parrafo }}
                  </p>
                </div>
              </div>

              <div v-if="seccionBiografiaOrdenada.notes.length"
                class="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 sm:p-5 transition duration-200 hover:-translate-y-0.5 hover:border-amber-400/65 hover:bg-amber-400/15">
                <div class="mb-3 flex items-center gap-2">
                  <span aria-hidden="true" class="text-xs text-amber-300">
                    <i class="ri-edit-line"></i>
                  </span>
                  <span
                    class="rounded bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300">
                    NOTE
                  </span>
                </div>

                <div class="space-y-3">
                  <p v-for="(nota, idx) in seccionBiografiaOrdenada.notes" :key="`note-${idx}`" :class="[
                    'whitespace-pre-line text-xs sm:text-sm leading-relaxed text-pergamino/85',
                    idx > 0 ? 'border-t border-amber-400/15 pt-3' : '',
                  ]">
                    {{ nota }}
                  </p>
                </div>
              </div>

              <div v-if="seccionBiografiaOrdenada.spoilers.length"
                class="overflow-hidden rounded-xl border border-rojo-coral/35 bg-rojo-coral/10 transition duration-200 hover:border-rojo-coral/70">
                <button type="button" :aria-expanded="spoilerAbierto" @click="spoilerAbierto = !spoilerAbierto"
                  class="flex w-full cursor-pointer items-center justify-between gap-3 p-4 sm:px-5 text-left transition hover:bg-rojo-coral/15">
                  <div class="flex items-center gap-2">
                    <span aria-hidden="true" class="text-xs text-rojo-coral">
                      <i class="ri-alert-line"></i>
                    </span>
                    <span
                      class="rounded bg-rojo-coral/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-rojo-coral">
                      SPOILER
                    </span>
                    <span class="text-[11px] text-pergamino/60">
                      {{ spoilerAbierto ? 'Hide spoiler content' : 'Click to reveal spoiler content' }}
                    </span>
                  </div>

                  <span aria-hidden="true" :class="[
                    'text-xs font-bold text-rojo-coral transition-transform duration-200',
                    spoilerAbierto ? 'rotate-180' : '',
                  ]">
                    <i class="ri-arrow-down-s-line"></i>
                  </span>
                </button>

                <div v-if="spoilerAbierto"
                  class="border-t border-rojo-coral/20 bg-black/20 px-4 py-4 sm:px-5 space-y-3">
                  <p v-for="(spoilerTexto, idx) in seccionBiografiaOrdenada.spoilers" :key="`spoiler-${idx}`" :class="[
                    'whitespace-pre-line text-xs sm:text-sm leading-relaxed text-pergamino/85',
                    idx > 0 ? 'border-t border-rojo-coral/15 pt-3' : '',
                  ]">
                    {{ spoilerTexto }}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  </div>
</template>