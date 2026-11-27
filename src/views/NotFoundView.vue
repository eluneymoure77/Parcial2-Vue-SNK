<script setup>
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

function volverAtras() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <div class="error-404-seccion px-4 pt-24 pb-12 sm:px-8 lg:px-14">
    <section aria-labelledby="titulo-404" class="error-404-tarjeta">
      <div class="grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-12">
        <!-- Ilustración de Hange con el mapa 404 -->
        <div class="flex flex-col items-center justify-center lg:col-span-5">
          <img src="/img/pantalla-error/hange-mapa-404.png" alt="Hange surprised holding a burnt map with a 404 mark"
            class="error-404-img" />
        </div>

        <!-- Texto y acciones -->
        <div class="space-y-4 text-center lg:col-span-7 lg:text-left">
          <span
            class="inline-block rounded-md border border-rojo-coral/40 bg-bordo-oscuro/45 px-3 py-1 font-rubik text-[11px] font-bold tracking-[0.14em] uppercase text-rojo-coral">
            404 · UNMAPPED LOCATION
          </span>

          <h1 id="titulo-404" class="font-fell text-3xl sm:text-4xl lg:text-[2.85rem] leading-[1.08] text-hueso">
            We couldn't find any records of this location.
          </h1>

          <p class="mx-auto max-w-xl font-sans text-sm sm:text-base leading-relaxed text-pergamino/75 lg:mx-0">
            It seems this passage isn't drawn on the Legion's maps. Check the route or return to a safe point to keep
            exploring.
          </p>

          <nav aria-label="Error recovery navigation"
            class="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
            <RouterLink :to="{ name: 'home' }"
              class="inline-flex min-h-11 items-center justify-center rounded-lg bg-verde-medio px-5 py-2.5 font-rubik text-xs sm:text-sm font-bold uppercase tracking-wider text-carbon no-underline transition hover:bg-verde-claro">
              Back to home
            </RouterLink>

            <RouterLink :to="{ name: 'personajes' }"
              class="inline-flex min-h-11 items-center justify-center rounded-lg border border-pergamino/20 bg-white/5 px-5 py-2.5 font-rubik text-xs sm:text-sm font-semibold uppercase tracking-wider text-hueso no-underline transition hover:border-pergamino/40 hover:bg-white/10">
              View characters
            </RouterLink>

            <button type="button" @click="volverAtras"
              class="inline-flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 font-rubik text-xs sm:text-sm font-medium text-pergamino/75 transition hover:text-hueso">
              <i class="ri-arrow-left-line" aria-hidden="true"></i>
              <span>Go back</span>
            </button>
          </nav>
        </div>
      </div>
    </section>
  </div>
</template>
