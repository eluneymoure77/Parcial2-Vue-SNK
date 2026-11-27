<script setup>
import { RouterLink } from 'vue-router'
import SectionHeroBanner from '../components/SectionHeroBanner.vue'
import ExploreSidebar from '../components/ExploreSidebar.vue'
import { usePersonajes } from '../composables/usePersonajes.js'
import { useDivisiones } from '../composables/useDivisiones.js'
import { VISTAS_CONFIG } from '../data/vistasConfig.js'

defineProps({
  videoSrc: {
    type: String,
    default: '/video/banner-video.mp4',
  },
})

const { usarFallback } = usePersonajes()
const {
  divisionDetalle: division,
  imagenBannerActual,
  valoresLista,
  detalleVisual,
} = useDivisiones()

</script>

<template>
  <div class="min-h-svh bg-carbon text-pergamino">
    <SectionHeroBanner variant="seccion" :image-src="imagenBannerActual" :video-src="videoSrc"
      v-bind="VISTAS_CONFIG.divisionDetalle.banner" :title="(division.nombreLargo || division.nombre).toUpperCase()"
      :description="division.subtitulo" />

    <div class="personajes-layout division-detalle-layout">
      <ExploreSidebar />

      <div class="min-w-0 flex-1">
        <article
          class="group/panel overflow-hidden rounded-2xl border border-pergamino/12 bg-[#141715]/95 shadow-xl transition-all duration-200 hover:border-pergamino/25 hover:shadow-[0_16px_34px_-10px_rgba(0,0,0,0.65)]">
          <!-- Encabezado y descripción de la división -->
          <header class="border-b border-pergamino/10 p-4 sm:p-6 lg:p-7">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span :class="[
                'rounded-md border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors duration-200 group-hover/panel:border-pergamino/35',
                detalleVisual.badgeEstilo,
              ]">
                {{ division.nombreEn }}
              </span>

              <span class="font-mono text-[11px] text-pergamino/55">
                MILITARY BRANCH // {{ detalleVisual.codigoBranch }}
              </span>
            </div>

            <h2 :class="[
              'mt-3 flex items-center gap-2.5 sm:gap-3 font-rubik text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight',
              division.theme?.text || 'text-hueso',
            ]">
              <span>{{ division.nombreLargo || division.nombre }}</span>
              <i :class="[
                detalleVisual.iconoDivision,
                'text-xl sm:text-2xl lg:text-3xl shrink-0 transition-transform duration-200 group-hover/panel:scale-110',
              ]" aria-hidden="true"></i>
            </h2>

            <p class="mt-1.5 text-xs sm:text-sm font-medium text-pergamino/75">
              {{ division.subtitulo }}
            </p>

            <p
              class="mt-4 rounded-xl border border-transparent bg-carbon/55 p-4 text-xs sm:text-sm leading-relaxed text-pergamino/85 transition-all duration-200 hover:-translate-y-0.5 hover:border-pergamino/15 hover:bg-carbon/80">
              {{ division.descripcion }}
            </p>

            <!-- Valores y cita -->
            <section aria-label="Core values and motto"
              class="group/values mt-6 rounded-xl border border-pergamino/10 bg-carbon/70 p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-pergamino/25 hover:bg-[#191d1b] hover:shadow-[0_12px_26px_-10px_rgba(0,0,0,0.55)]">
              <div class="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
                <div class="flex shrink-0 flex-col items-start gap-2 md:w-28">
                  <span
                    class="flex h-9 w-9 items-center justify-center rounded-lg border border-pergamino/15 bg-white/5 text-base text-lima-acento transition-all duration-200 group-hover/values:scale-105 group-hover/values:border-lima-acento/50 group-hover/values:bg-verde-card/30"
                    aria-hidden="true">
                    <i :class="detalleVisual.iconoValores"></i>
                  </span>

                  <span class="font-rubik text-[10px] font-bold uppercase tracking-[0.2em] text-pergamino/55">
                    Core Values
                  </span>
                </div>

                <div :class="[
                  'min-w-0 flex-1 space-y-3 border-l-2 pl-4 sm:pl-5',
                  detalleVisual.acentoBorde,
                ]">
                  <div class="flex flex-wrap gap-2">
                    <span v-for="(valor, idx) in valoresLista" :key="idx"
                      class="inline-flex items-center rounded-full border border-pergamino/15 bg-white/5 px-3.5 py-1 text-xs font-semibold text-hueso transition-all duration-200 hover:-translate-y-0.5 hover:border-verde-claro/50 hover:bg-verde-card/30 hover:text-hueso">
                      {{ valor }}
                    </span>
                  </div>

                  <blockquote class="font-fell text-base sm:text-lg italic leading-relaxed text-pergamino/85">
                    "{{ division.quote }}"
                  </blockquote>
                </div>
              </div>
            </section>
          </header>

          <!-- Miembros destacados de la división -->
          <section aria-labelledby="division-members-heading" class="bg-black/25 px-4 py-6 sm:px-6 lg:px-7">
            <header class="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 id="division-members-heading"
                class="font-rubik text-sm sm:text-base font-bold uppercase tracking-wider text-hueso">
                Members of {{ division.nombreLargo || division.nombre }}
              </h3>

              <RouterLink :to="{ name: 'personajes' }"
                class="group inline-flex items-center gap-1 text-xs font-bold text-lima-acento no-underline transition-all duration-200 hover:underline">
                <span>View all characters</span>
                <i class="ri-arrow-right-s-line text-sm transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"></i>
              </RouterLink>
            </header>

            <div class="division-detalle-miembros-grid">
              <article v-for="miembro in division.miembros" :key="miembro.id" class="snk-card">
                <div class="snk-card-cabecera">
                  <div aria-hidden="true" class="snk-card-circulo h-36 w-36"></div>
                  <img :src="miembro.imagen" :alt="miembro.nombre" @error="usarFallback"
                    class="relative z-1 transition-transform duration-300 hover:scale-105" />
                </div>

                <div class="flex flex-1 flex-col justify-between gap-2 pt-0.5">
                  <h4 class="truncate font-rubik text-xs sm:text-sm font-bold text-hueso">
                    {{ miembro.nombre }}
                  </h4>

                  <RouterLink v-if="miembro.personajeId"
                    :to="{ name: 'personaje-detalle', params: { id: miembro.personajeId } }" class="snk-card-boton">
                    <span>View archive</span>
                    <i class="ri-arrow-right-s-line text-base" aria-hidden="true"></i>
                  </RouterLink>
                </div>
              </article>
            </div>

            <!-- Acciones inferiores -->
            <div
              class="mt-6 flex flex-col gap-3 rounded-xl border border-pergamino/10 bg-carbon/45 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-pergamino/20 hover:bg-carbon/75 sm:flex-row sm:items-center">
              <RouterLink :to="{ name: 'home', hash: '#section-quiz' }" :class="[
                'inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2.5 font-rubik text-xs sm:text-sm font-bold no-underline transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110',
                division.theme?.btn || 'bg-lima-acento hover:bg-verde-medio',
                division.theme?.btnText || 'text-carbon',
              ]">
                Take the recruitment test
              </RouterLink>

              <RouterLink :to="{ name: 'home' }"
                class="inline-flex min-h-11 items-center justify-center rounded-lg border border-pergamino/20 bg-black/35 px-5 py-2.5 font-rubik text-xs sm:text-sm font-semibold text-pergamino no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-pergamino/40 hover:bg-white/10">
                Return to home
              </RouterLink>
            </div>
          </section>
        </article>
      </div>
    </div>
  </div>
</template>