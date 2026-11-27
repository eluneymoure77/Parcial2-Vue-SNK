<script setup>
import { computed, onMounted, ref } from 'vue'
import { useSnkApi } from '../composables/useSnkApi.js'

defineProps({
  imagenBannerSrc: {
    type: String,
    default: '/img/inicio/archivo-snk-banner.png',
  },
  imagenTitanesSrc: {
    type: String,
    default: '/img/inicio/clasificacion-titanes.png',
  },
  imagenColosalSrc: {
    type: String,
    default: '/img/inicio/titan-colosal.png',
  },
})

const {
  animeInfo,
  personajes,
  cargandoAnime,
  cargandoPersonajes,
  errorAnime,
  obtenerAnime,
  obtenerPersonajes,
} = useSnkApi()

const pestanaActiva = ref('episodes')

onMounted(() => {
  obtenerAnime()
  obtenerPersonajes()
})

const nombrePrincipal = computed(() => animeInfo.value?.title || 'Shingeki no Kyojin')
const nombreJapones = computed(() => animeInfo.value?.title_japanese || '進撃の巨人')

const metricas = computed(() => {
  const d = animeInfo.value || {}
  const releaseYear =
  d.year ||
  d.aired?.prop?.from?.year ||
  d.aired?.from?.slice(0, 4) ||
  '2013'

  return {
    episodes: {
      number: '01',
      label: 'EPISODES',
      eyebrow: 'OFFICIAL RECORD',
      value: d.episodes ?? '—',
      suffix: 'approx.',
      unit: 'TOTAL EPISODES',
      note: 'Seasons 1–4 and specials included in the official archive.',
    },
    score: {
      number: '02',
      label: 'SERIES SCORE',
      eyebrow: 'COMMUNITY RATING',
      value: d.score ?? '—',
      suffix: d.rank ? `#${d.rank} rank` : '/ 10',
      unit: 'AVERAGE SCORE',
      note: d.scored_by
        ? `Based on ${Number(d.scored_by).toLocaleString('en-US')} user ratings.`
        : 'Historical rating from the anime archive.',
    },
    characters: {
      number: '03',
      label: 'REGISTERED CHARACTERS',
      eyebrow: 'CADETS & TITANS INDEX',
      value: personajes.value.length || '—',
      suffix: 'entries',
      unit: 'CHARACTERS RECORDED',
      note: 'Main and supporting characters fetched from the series archive.',
    },
    year: {
      number: '04',
      label: 'RELEASE YEAR',
      eyebrow: 'BROADCAST ORIGIN',
      value: releaseYear,
      suffix: d.season ? d.season.toUpperCase() : '',
      unit: 'FIRST AIRED',
      note: d.status || 'Original broadcast year of Attack on Titan.',
    },
  }
})

const metricaActual = computed(() => metricas.value[pestanaActiva.value])
const estaCargando = computed(() => cargandoAnime.value || cargandoPersonajes.value)
</script>

<template>
  <section
    aria-labelledby="war-freedom-heading"
    class="info-seccion-fondo relative w-full overflow-hidden bg-carbon pt-10 sm:pt-12 md:pt-14 pb-10 sm:pb-12 lg:pb-14 text-pergamino"
  >
    <div class="relative z-10 mx-auto max-w-6xl px-4 sm:px-8 md:px-10">
      <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-8">
        <div class="lg:col-span-5">
          <h2
            id="war-freedom-heading"
            class="mx-auto max-w-xl text-center font-rubik text-3xl sm:text-4xl lg:mx-0 lg:max-w-md lg:text-left lg:text-[2.15rem] font-bold leading-tight text-hueso"
          >
            A story that reflects a war for the
            <span class="font-fell italic font-normal text-rojo-coral">right to be free.</span>
          </h2>
        </div>

        <div class="lg:col-span-7 lg:ml-auto lg:w-full lg:max-w-[600px]">
          <div aria-hidden="true" class="colosal-corona">
            <img
              :src="imagenColosalSrc"
              alt=""
              loading="lazy"
              class="block h-auto w-full object-contain object-bottom"
            />
          </div>

          <article class="archivo-ficha relative z-10">
            <header class="relative h-40 sm:h-48 w-full overflow-hidden bg-bosque-oscuro">
              <img
                :src="imagenBannerSrc"
                :alt="nombrePrincipal"
                loading="lazy"
                class="h-full w-full object-cover object-top"
              />

              <div
                aria-hidden="true"
                class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
              ></div>

              <div class="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-3.5 sm:p-5">
                <div class="mb-1 flex items-center gap-2">
                  <span aria-hidden="true" class="h-0.5 w-4 shrink-0 bg-rojo-coral"></span>
                  <span class="font-rubik text-[0.65rem] font-bold tracking-[0.14em] uppercase text-white/85">
                    SERIES ARCHIVE
                  </span>
                </div>

                <div class="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                  <h3 class="font-fell text-xl sm:text-3xl leading-none text-white">
                    {{ nombrePrincipal }}
                  </h3>
                  <span
                    lang="ja"
                    class="font-rubik text-xs font-medium text-white/80"
                  >
                    {{ nombreJapones }}
                  </span>
                </div>
              </div>
            </header>

            <!-- Card con info -->
            <div class="p-3.5 sm:p-5">
              <p
                v-if="errorAnime"
                role="alert"
                class="mb-3 rounded-lg bg-bordo-oscuro/15 px-3 py-2 text-xs font-medium text-bordo-oscuro"
              >
                {{ errorAnime }}
              </p>

              <div class="grid grid-cols-1 items-stretch gap-3.5 md:grid-cols-12">
                <div class="flex flex-col md:col-span-6">
                  <p class="mb-2.5 font-rubik text-[0.68rem] font-bold tracking-[0.12em] uppercase text-muted">
                    THE SERIES IN NUMBERS
                  </p>

                  <div class="flex flex-col gap-1.5" role="tablist" aria-label="Series metrics">
                    <button
                      v-for="(item, key) in metricas"
                      :key="key"
                      type="button"
                      role="tab"
                      :aria-selected="pestanaActiva === key"
                      class="archivo-pestana"
                      :class="
                        pestanaActiva === key ? 'archivo-pestana-activa' : 'archivo-pestana-inactiva'
                      "
                      @click="pestanaActiva = key"
                    >
                      <span aria-hidden="true" class="shrink-0 opacity-75">{{ item.number }}</span>
                      <span class="whitespace-nowrap text-[0.72rem] sm:text-xs leading-none">
                        {{ item.label }}
                      </span>
                    </button>
                  </div>
                </div>

                <div
                  role="tabpanel"
                  class="flex flex-col justify-between rounded-xl bg-bosque-oscuro p-4 sm:p-5 text-pergamino md:col-span-6"
                >
                  <div>
                    <div class="flex items-center gap-2">
                      <span aria-hidden="true" class="h-3 w-0.5 shrink-0 rounded-xs bg-rojo-coral"></span>
                      <p class="font-rubik text-[0.65rem] font-bold tracking-[0.12em] uppercase text-verde-claro">
                        {{ metricaActual.eyebrow }}
                      </p>
                    </div>

                    <div class="mt-1.5 flex flex-wrap items-baseline gap-2">
                      <span class="font-rubik text-3xl sm:text-5xl font-extrabold leading-none text-hueso">
                        {{ estaCargando ? '...' : metricaActual.value }}
                      </span>
                      <span
                        v-if="!estaCargando && metricaActual.suffix"
                        class="font-rubik text-xs text-pergamino/75"
                      >
                        {{ metricaActual.suffix }}
                      </span>
                    </div>

                    <p class="mt-1 font-rubik text-xs font-bold tracking-wider uppercase text-hueso">
                      {{ metricaActual.unit }}
                    </p>
                  </div>

                  <p class="mt-3 border-t border-verde-pizarra pt-2.5 text-xs leading-relaxed text-pergamino/80">
                    {{ metricaActual.note }}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>

    <!-- Imgagen titan -->
    <div
      aria-hidden="true"
      class="pointer-events-none hidden lg:block lg:absolute lg:bottom-0 lg:left-6 xl:left-12 lg:z-10 lg:w-[330px] xl:w-[390px]"
    >
      <img
        :src="imagenTitanesSrc"
        alt=""
        loading="lazy"
        class="block h-auto w-full object-contain object-bottom"
      />
    </div>
  </section>
</template>
