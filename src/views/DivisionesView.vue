<script setup>
import { RouterLink } from 'vue-router'
import SectionHeroBanner from '../components/SectionHeroBanner.vue'
import ExploreSidebar from '../components/ExploreSidebar.vue'
import { useDivisiones } from '../composables/useDivisiones.js'
import { VISTAS_CONFIG } from '../data/vistasConfig.js'

defineProps({
  videoSrc: {
    type: String,
    default: '/video/banner-video.mp4',
  },
})

const { divisions, totalDivisiones, obtenerDescripcionCorta } = useDivisiones()
</script>

<template>
  <div class="min-h-svh bg-carbon text-pergamino">
    <SectionHeroBanner
      variant="seccion"
      :video-src="videoSrc"
      v-bind="VISTAS_CONFIG.divisiones.banner"
    />

    <!-- SideBar + Cards de divisiones -->
    <div class="personajes-layout">
      <ExploreSidebar />

      <div class="min-w-0 flex-1">
        <header class="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="font-rubik text-2xl sm:text-3xl font-bold text-hueso">Divisions</h2>
            <p class="mt-1 text-xs sm:text-sm text-pergamino/75">
              The three main branches of the military forces.
            </p>
          </div>

          <span class="rounded-md bg-verde-pizarra px-3 py-1 text-xs sm:text-sm font-semibold text-pergamino">
            {{ totalDivisiones }} divisions
          </span>
        </header>

        <!-- Grilla de 3 cards -->
        <section aria-label="Military divisions" class="divisiones-grid">
          <article
            v-for="division in divisions"
            :key="division.id"
            class="division-card"
          >
            <div class="division-card-media">
              <div aria-hidden="true" class="snk-card-circulo h-36 w-36 sm:h-40 sm:w-40"></div>
              <div aria-hidden="true" class="snk-card-circulo h-24 w-24 sm:h-28 sm:w-28"></div>

              <img
                :src="division.escudo"
                :alt="`${division.nombre} emblem`"
                class="division-card-img relative z-10"
              />
            </div>

            <div class="division-card-cuerpo">
              <div>
                <h3 class="font-rubik text-xl font-bold text-hueso">
                  {{ division.nombre }}
                </h3>

                <p class="mt-2.5 text-xs sm:text-sm leading-relaxed text-pergamino/75">
                  {{ obtenerDescripcionCorta(division) }}
                </p>
              </div>

              <div class="mt-5">
                <RouterLink
                  :to="{ name: 'division-detalle', params: { id: division.id } }"
                  class="division-card-btn"
                >
                  <span>View more info</span>
                  <i class="ri-arrow-right-up-line" aria-hidden="true"></i>
                </RouterLink>
              </div>
            </div>
          </article>
        </section>
      </div>
    </div>
  </div>
</template>