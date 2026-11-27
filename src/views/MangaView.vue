<script setup>
import { computed, onMounted } from 'vue'
import SectionHeroBanner from '../components/SectionHeroBanner.vue'
import ExploreSidebar from '../components/ExploreSidebar.vue'
import { useSnkApi } from '../composables/useSnkApi.js'
import PantallaBug from '../components/PantallaBug.vue'
import { VISTAS_CONFIG } from '../data/vistasConfig.js'

defineProps({
  videoSrc: {
    type: String,
    default: '/video/banner-video.mp4',
  },
})

const {
  mangaInfo,
  mangaMoreInfo,
  cargandoManga,
  errorManga,
  obtenerManga,
  obtenerMangaMoreInfo,
} = useSnkApi()

onMounted(() => {
  obtenerManga()
  obtenerMangaMoreInfo()
})

function partirParrafos(texto) {
  if (!texto || !String(texto).trim()) return []
  return String(texto)
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

function unirNombres(lista, fallback) {
  if (!Array.isArray(lista) || lista.length === 0) return fallback
  return lista.map((item) => item?.name).filter(Boolean).join(', ') || fallback
}

const CATEGORIAS_BACKGROUND = [
  {
    palabras: ['award', 'prize', 'nominated'],
    categoria: 'Award & Recognition',
    icono: 'ri-award-line',
  },
  {
    palabras: ['copies', 'omnibus', 'edition'],
    categoria: 'Sales & Editions',
    icono: 'ri-book-open-line',
  },
  {
    palabras: ['published in', 'simulpublished', 'french', 'spanish'],
    categoria: 'Global Releases',
    icono: 'ri-global-line',
  },
  {
    palabras: ['guidebook', 'drama cd', 'live-action', 'adaptation'],
    categoria: 'Adaptations & Media',
    icono: 'ri-film-line',
  },
]

const tituloPrincipal = computed(
  () => mangaInfo.value?.title_english || mangaInfo.value?.title || 'Attack on Titan'
)

const tituloOriginal = computed(
  () => mangaInfo.value?.title || mangaInfo.value?.title_japanese || 'Shingeki no Kyojin'
)

const portadaUrl = computed(() => {
  const m = mangaInfo.value
  return (
    m?.images?.webp?.large_image_url ||
    m?.images?.jpg?.large_image_url ||
    m?.images?.webp?.image_url ||
    m?.images?.jpg?.image_url ||
    '/img/personajes/fallback.png'
  )
})

const autoresTexto = computed(() => unirNombres(mangaInfo.value?.authors, 'Hajime Isayama'))

const serializacionTexto = computed(() =>
  unirNombres(mangaInfo.value?.serializations, 'Bessatsu Shonen Magazine')
)

const etiquetasTematicas = computed(() => {
  const generos = mangaInfo.value?.genres || []
  const temas = mangaInfo.value?.themes || []
  return [...generos, ...temas].map((item) => item?.name).filter(Boolean)
})

const periodoPublicacion = computed(
  () =>
    mangaInfo.value?.published?.string ||
    mangaInfo.value?.published?.from?.slice(0, 10) ||
    'Archive record'
)

const parrafosSinopsis = computed(() => partirParrafos(mangaInfo.value?.synopsis))

const parrafosMoreInfo = computed(() => partirParrafos(mangaMoreInfo.value))

const puntosBackground = computed(() => {
  const texto = mangaInfo.value?.background || ''
  if (!texto.trim()) return []

  return texto
    .split(/\.(?=\s+[A-Z0-9])/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((oracion) => {
      const textoFinal = oracion.endsWith('.') ? oracion : `${oracion}.`
      const lower = textoFinal.toLowerCase()
      const regla = CATEGORIAS_BACKGROUND.find((c) =>
        c.palabras.some((palabra) => lower.includes(palabra))
      )

      return {
        categoria: regla?.categoria || 'Archive Note',
        icono: regla?.icono || 'ri-file-text-line',
        texto: textoFinal,
      }
    })
})

</script>

<template>
  <div class="min-h-svh bg-carbon text-pergamino">
    <SectionHeroBanner
      variant="seccion"
      :video-src="videoSrc"
      v-bind="VISTAS_CONFIG.manga.banner"
    />

    <!-- SideBar + Info del Manga -->
    <div class="personajes-layout manga-layout">
      <ExploreSidebar />

      <div class="manga-main min-w-0 flex-1">
        <!-- Encabezado de sección -->
        <header class="manga-header mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="font-rubik text-2xl sm:text-3xl font-bold text-hueso">
              Manga Chronicle
            </h2>
            <p class="mt-1 text-xs sm:text-sm text-pergamino/75">
              Editorial log fetched from Tenrai Archive (#23390).
            </p>
          </div>

          <span
            v-if="errorManga"
            class="personajes-pill-sin-conexion"
          >
            Offline
          </span>
          <span
            v-else-if="mangaInfo?.status"
            class="rounded-md bg-verde-pizarra px-3 py-1 text-xs sm:text-sm font-semibold text-pergamino"
          >
            {{ mangaInfo.status }}
          </span>
        </header>

        <!-- Estado cargando -->
        <div
          v-if="cargandoManga && !mangaInfo"
          class="rounded-2xl border border-pergamino/10 bg-[#141715]/95 p-8 text-center text-sm text-pergamino/80"
        >
          Loading manga entry from the archive...
        </div>

        <!-- Pantalla de error API -->
        <PantallaBug
          v-else-if="errorManga && !mangaInfo"
          v-bind="VISTAS_CONFIG.manga.errorConexion"
          :cargando="cargandoManga"
          @reintentar="() => { obtenerManga(); obtenerMangaMoreInfo() }"
        />

        <!--  Artículo con info Manga -->
        <article
          v-else-if="mangaInfo"
          class="manga-article overflow-hidden rounded-2xl border border-pergamino/12 bg-[#141715]/95 shadow-xl"
        >
          <div class="manga-article-top grid grid-cols-1 gap-6 border-b border-pergamino/10 p-5 sm:p-7 lg:grid-cols-[230px_minmax(0,1fr)] lg:items-start">
            <div class="manga-cover-frame">
              <img
                :src="portadaUrl"
                :alt="`${tituloPrincipal} manga cover`"
              />
            </div>

            <div class="min-w-0 space-y-4">
              <div class="flex flex-wrap items-center gap-2 text-xs text-pergamino/70">
                <span class="rounded-md bg-verde-card/35 px-2.5 py-1 font-rubik font-semibold uppercase tracking-wider text-lima-acento">
                  Blog Entry · #{{ mangaInfo?.mal_id ?? 23390 }}
                </span>
                <span>{{ periodoPublicacion }}</span>
                <span aria-hidden="true">•</span>
                <span>By {{ autoresTexto }}</span>
              </div>

              <div>
                <h3 class="font-rubik text-2xl sm:text-3xl lg:text-[2.15rem] font-extrabold leading-tight text-hueso">
                  {{ tituloPrincipal }}
                </h3>
                <p
                  v-if="tituloOriginal && tituloOriginal !== tituloPrincipal"
                  class="mt-1 font-canon text-sm sm:text-base italic text-pergamino/70"
                >
                  {{ tituloOriginal }}
                </p>
              </div>

              <!-- Etiquetas de género -->
              <div v-if="etiquetasTematicas.length > 0" class="flex flex-wrap gap-2">
                <span
                  v-for="etiqueta in etiquetasTematicas"
                  :key="etiqueta"
                  class="manga-tag-pill"
                >
                  {{ etiqueta }}
                </span>
              </div>

              <!-- Métricas principales -->
              <dl class="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-4">
                <div class="manga-stat-card">
                  <dt class="text-[11px] uppercase tracking-wider text-pergamino/55">
                    Chapters
                  </dt>
                  <dd class="mt-0.5 font-rubik text-base sm:text-lg font-bold text-hueso">
                    {{ mangaInfo?.chapters ?? '—' }}
                  </dd>
                </div>

                <div class="manga-stat-card">
                  <dt class="text-[11px] uppercase tracking-wider text-pergamino/55">
                    Volumes
                  </dt>
                  <dd class="mt-0.5 font-rubik text-base sm:text-lg font-bold text-hueso">
                    {{ mangaInfo?.volumes ?? '—' }}
                  </dd>
                </div>

                <div class="manga-stat-card">
                  <dt class="text-[11px] uppercase tracking-wider text-pergamino/55">
                    Score
                  </dt>
                  <dd class="mt-0.5 font-rubik text-base sm:text-lg font-bold text-lima-acento">
                    {{ mangaInfo?.score ?? '—' }}
                  </dd>
                </div>

                <div class="manga-stat-card">
                  <dt class="text-[11px] uppercase tracking-wider text-pergamino/55">
                    Rank
                  </dt>
                  <dd class="mt-0.5 font-rubik text-base sm:text-lg font-bold text-hueso">
                    {{ mangaInfo?.rank ? `#${mangaInfo.rank}` : '—' }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Cuerpo editorial tipo blog -->
          <div class="manga-article-body space-y-6 p-5 sm:p-7 lg:p-8">
            <section
              aria-labelledby="manga-synopsis-heading"
              class="manga-synopsis-block space-y-3"
            >
              <h4
                id="manga-synopsis-heading"
                class="font-rubik text-lg sm:text-xl font-bold text-hueso"
              >
                Synopsis &amp; Story Premise
              </h4>

              <template v-if="parrafosSinopsis.length > 0">
                <p
                  v-for="(parrafo, idx) in parrafosSinopsis"
                  :key="idx"
                  class="max-w-4xl font-sans text-sm sm:text-[0.96rem] leading-relaxed text-pergamino/85"
                >
                  {{ parrafo }}
                </p>
              </template>
              <p v-else class="text-sm text-pergamino/70">
                No synopsis available in the API response.
              </p>
            </section>

            <!-- Contenido Note -->
            <section
              v-if="puntosBackground.length > 0"
              aria-labelledby="manga-background-heading"
              class="manga-editorial-box space-y-4"
            >
              <div class="flex flex-wrap items-center justify-between gap-2">
                <h4
                  id="manga-background-heading"
                  class="font-rubik text-sm font-bold uppercase tracking-wider text-verde-claro"
                >
                  Editorial Note / Background
                </h4>
                <span class="text-[11px] font-medium text-pergamino/50">
                  {{ puntosBackground.length }} highlights
                </span>
              </div>

              <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <article
                  v-for="(item, idx) in puntosBackground"
                  :key="idx"
                  class="manga-dato-item"
                >
                  <div class="manga-icon-badge" aria-hidden="true">
                    <i :class="[item.icono, 'text-base leading-none']"></i>
                  </div>

                  <div class="min-w-0 space-y-1">
                    <p class="font-rubik text-[10px] font-bold uppercase tracking-[0.14em] text-verde-claro/90">
                      {{ item.categoria }}
                    </p>
                    <p class="text-xs sm:text-[0.84rem] leading-relaxed text-pergamino/85">
                      {{ item.texto }}
                    </p>
                  </div>
                </article>
              </div>
            </section>

            <!-- Mas info -->
            <section
              v-if="parrafosMoreInfo.length > 0"
              aria-labelledby="manga-moreinfo-heading"
              class="manga-editorial-box space-y-2.5"
            >
              <h4
                id="manga-moreinfo-heading"
                class="font-rubik text-sm font-bold uppercase tracking-wider text-lima-acento"
              >
                More Info
              </h4>

              <p
                v-for="(parrafo, idx) in parrafosMoreInfo"
                :key="idx"
                class="text-xs sm:text-sm leading-relaxed text-pergamino/85"
              >
                {{ parrafo }}
              </p>
            </section>

            <footer class="manga-article-footer">
              <span>
                Magazine:
                <strong class="font-semibold text-pergamino/90">{{ serializacionTexto }}</strong>
              </span>
              <span v-if="mangaInfo?.popularity">
                Popularity:
                <strong class="font-semibold text-pergamino/90">#{{ mangaInfo.popularity }}</strong>
              </span>
            </footer>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
