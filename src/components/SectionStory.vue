<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  bannerInferiorSrc: {
    type: String,
    default: '/img/inicio/eren-tejados.png',
  },
  fondoSrc: {
    type: String,
    default: '/img/inicio/fondo-seccionhistoria.png',
  },
})

const emit = defineEmits(['abrir-instructor'])

const tarjetas = [
  {
    numero: '01',
    titulo: 'CHARACTERS',
    texto: 'From cadet to Titan: meet the faces of the fight for freedom.',
    boton: 'EXPLORE CHARACTERS',
    imagen: '/img/inicio/seccion-personajes.png',
    to: { name: 'personajes' },
    accionInstructor: false,
  },
  {
    numero: '02',
    titulo: 'MANGA',
    texto: 'The story that broke the walls. Return to the pages where it all began.',
    boton: 'GO TO MANGA',
    imagen: '/img/inicio/seccion-mangas.png',
    to: { name: 'manga' },
    accionInstructor: false,
  },
  {
    numero: '03',
    titulo: 'INSTRUCTOR',
    texto: 'Not sure where to start? Shadis pushes you forward with a recommendation.',
    boton: 'STEP FORWARD',
    imagen: '/img/inicio/seccion-instructor.png',
    to: null,
    accionInstructor: true,
  },
  {
    numero: '04',
    titulo: 'FAVORITES',
    texto: 'Save your squad and build your own personal lineup.',
    boton: 'VIEW MY SQUAD',
    imagen: '/img/inicio/seccion-favoritos.png',
    to: { name: 'favoritos' },
    accionInstructor: false,
  },
]

function alClickTarjeta(tarjeta) {
  if (tarjeta.accionInstructor) {
    emit('abrir-instructor')
  }
}

</script>

<template>
  <section
    aria-labelledby="titulo-historia"
    class="relative w-full overflow-hidden bg-marfil pt-14 sm:pt-20 md:pt-24 text-[#1c1b18]"
  >
    <img :src="fondoSrc" alt="" aria-hidden="true" loading="lazy" class="historia-fondo-sutil" />

    <div class="mx-auto max-w-280 px-4 sm:px-8 md:px-10">
      <header
        class="mb-8 sm:mb-10 md:mb-12 flex flex-col md:flex-row items-start justify-between gap-4 sm:gap-8 md:gap-14"
      >
        <div class="flex-1">
          <span aria-hidden="true" class="mb-2.5 block h-0.5 w-8.5 bg-[#c63b2f]"></span>
          <h2
            id="titulo-historia"
            class="flex flex-col text-[1.85rem] sm:text-[2.4rem] md:text-[2.85rem] leading-[1.12] text-[#20231e]"
          >
            <span class="font-rubik font-bold italic text-verde-medio">Your story</span>
            <strong class="font-fell font-normal">beyond the walls</strong>
          </h2>
        </div>

        <p
          class="w-full md:max-w-[36ch] font-canon text-[0.9rem] sm:text-[0.98rem] md:text-[1.02rem] leading-normal text-muted"
        >
          Find what inspires you: from the battles that shaped history to the characters who swore
          to reclaim freedom. Explore characters, manga, and favorites, or let the instructor guide
          your next step.
        </p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-[1.65rem]">
        <article
          v-for="item in tarjetas"
          :key="item.numero"
          class="tarjeta-paso min-h-46.25 sm:min-h-51.25 md:min-h-72.5 group"
        >
          <img
            :src="item.imagen"
            :alt="`${item.titulo} section preview`"
            loading="lazy"
            class="absolute inset-0 z-0 h-full w-full object-cover object-[center_20%] md:object-center transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />

          <div aria-hidden="true" class="tarjeta-velo absolute inset-0 z-1"></div>

          <span
            class="relative z-2 mb-auto mr-auto ml-3.5 mt-3.5 self-start rounded-sm bg-[#141210]/70 px-2 py-1 font-rubik text-[0.72rem] font-medium tracking-[0.04em] text-[#e6e2da]"
          >
            {{ item.numero }}
          </span>

          <div class="relative z-2 flex max-h-full flex-col gap-1.5 pt-4">
            <h3
              class="px-4 sm:px-5 md:px-[1.35rem] font-fell text-[1.2rem] sm:text-[1.4rem] md:text-[1.55rem] font-normal tracking-wider text-hueso"
            >
              {{ item.titulo }}
            </h3>

            <p
              class="mb-2 md:mb-3.5 px-4 sm:px-5 md:px-[1.35rem] font-canon text-[0.84rem] sm:text-[0.9rem] md:text-[0.95rem] leading-[1.35] text-hueso/85 line-clamp-3 md:line-clamp-2"
            >
              {{ item.texto }}
            </p>

            <RouterLink v-if="item.to" :to="item.to" class="tarjeta-barra">
              <span>{{ item.boton }}</span>
              <span aria-hidden="true">↗</span>
            </RouterLink>

            <button v-else type="button" class="tarjeta-barra" @click="alClickTarjeta(item)">
              <span>{{ item.boton }}</span>
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </article>
      </div>
    </div>

    <div class="relative -mt-2 sm:-mt-4 md:-mt-6 w-full">
      <img
        :src="bannerInferiorSrc"
        alt="Eren on the rooftops looking toward the wall"
        loading="lazy"
        class="block h-auto min-h-60 sm:min-h-85 md:min-h-110 w-full object-cover object-top"
      />
    </div>
  </section>
</template>
