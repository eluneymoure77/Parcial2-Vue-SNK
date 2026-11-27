<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  variant: {
    type: String,
    default: 'seccion', // 'inicio' | 'seccion'
  },
  videoSrc: {
    type: String,
    default: '/video/banner-video.mp4',
  },
  imageSrc: {
    type: String,
    default: '',
  },
  eyebrowPrefix: {
    type: String,
    default: '',
  },
  eyebrowHighlight: {
    type: String,
    default: '',
  },
  eyebrowSuffix: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  mostrarAvisoSpoilers: {
    type: Boolean,
    default: false,
  },
  inicioLineaSuperior: {
    type: String,
    default: 'THE RUMBLING',
  },
  inicioLineaPrincipal: {
    type: String,
    default: 'BEGINS',
  },
})

const emit = defineEmits(['abrir-instructor'])
</script>

<template>
  <section
    v-if="variant === 'inicio'"
    aria-label="Banner principal de Shingeki no Kyojin"
    class="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-tinta px-5 pt-24 pb-16 sm:px-8 md:px-12 md:pt-28 md:pb-24 text-hueso"
  >
    <img
      v-if="imageSrc"
      :src="imageSrc"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center opacity-55"
    />
    <video
      :src="videoSrc"
      autoplay
      loop
      muted
      playsinline
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center"
    ></video>

    <div aria-hidden="true" class="hero-overlay pointer-events-none absolute inset-0 z-1"></div>

    <div class="relative z-2 flex w-full max-w-205 flex-col items-center gap-4 sm:gap-6 text-center">
      <h1 class="flex flex-col leading-[1.05]">
        <span class="font-fell text-[2rem] sm:text-[3.1rem] md:text-[4.2rem] font-normal uppercase">
          {{ inicioLineaSuperior }}
        </span>
        <span class="font-rubik text-[2.1rem] sm:text-[3.3rem] md:text-[4.5rem] font-extrabold italic uppercase">
          {{ inicioLineaPrincipal }}
        </span>
      </h1>

      <p class="max-w-[58ch] font-canon text-[0.98rem] sm:text-[1.08rem] md:text-[1.18rem] leading-[1.55]">
        {{
          description ||
          "A hundred years behind the Walls wasn't enough to stop them. Join the expedition for freedom: explore the seasons, characters, and the manga that started it all."
        }}
      </p>

      <div class="flex w-full max-w-85 sm:max-w-none flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
        <RouterLink :to="{ name: 'personajes' }" class="btn-hero btn-hero-verde">
          JOIN THE EXPEDITION
        </RouterLink>

        <button type="button" class="btn-hero btn-hero-borde" @click="emit('abrir-instructor')">
          REPORT TO THE INSTRUCTOR
        </button>
      </div>
    </div>
  </section>

  <!-- Banner de Secciones (Characters, Favorites, Divisions, Manga) -->
  <section
    v-else
    :aria-label="`${title || 'Section'} banner`"
    class="personajes-banner"
  >
    <img
      v-if="imageSrc"
      :src="imageSrc"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center opacity-75"
    />
    <video
      v-else
      :src="videoSrc"
      autoplay
      loop
      muted
      playsinline
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center opacity-75"
    ></video>

    <div aria-hidden="true" class="hero-overlay pointer-events-none absolute inset-0 z-1"></div>

    <div class="relative z-2 mx-auto flex w-full max-w-7xl flex-col items-start gap-3 sm:gap-4">
      <p
        v-if="eyebrowPrefix || eyebrowHighlight || eyebrowSuffix"
        class="font-fell text-lg sm:text-2xl lg:text-[1.65rem] tracking-[0.14em] uppercase text-hueso/90"
      >
        <template v-if="eyebrowPrefix">{{ eyebrowPrefix }} </template>
        <span v-if="eyebrowHighlight" style="color: var(--color-verde-claro);">
          {{ eyebrowHighlight }}
        </span>
        <template v-if="eyebrowSuffix"> {{ eyebrowSuffix }}</template>
      </p>

      <h1 class="font-rubik text-3xl sm:text-5xl lg:text-[3.4rem] font-extrabold italic leading-[1.06] tracking-tight uppercase text-hueso">
        {{ title }}
      </h1>

      <p
        v-if="description"
        class="max-w-2xl font-sans text-sm sm:text-base leading-relaxed text-hueso/85"
      >
        {{ description }}
      </p>

      <aside
        v-if="mostrarAvisoSpoilers"
        aria-label="Spoiler warning"
        class="personajes-banner-aviso mt-1"
      >
        <span aria-hidden="true">⚠️</span>
        <span><strong>WARNING:</strong> Some profiles may contain spoilers.</span>
      </aside>
    </div>
  </section>
</template>
