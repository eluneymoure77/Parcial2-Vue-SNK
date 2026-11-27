<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { usePersonajes } from '../composables/usePersonajes.js'
import { useSnkApi } from '../composables/useSnkApi.js'

defineProps({
  siluetaSrc: {
    type: String,
    default: '/img/inicio/silueta-misteriosa.png',
  },
})

const { personajes, cargandoPersonajes, errorPersonajes, obtenerPersonajes } = useSnkApi()
const { obtenerImagen, usarFallback } = usePersonajes()

const personaje = ref(null)
const fotoRuleta = ref('')
const girando = ref(false)
const revelado = ref(false)

let intervalo = null
let corte = null

onMounted(() => {
  obtenerPersonajes()
})

onUnmounted(() => {
  limpiar()
})

const idPersonaje = computed(() => personaje.value?.character?.mal_id ?? '')

const nombrePersonaje = computed(() => {
  const raw = personaje.value?.character?.name || 'Unknown Character'
  if (!raw.includes(',')) return raw
  const [apellido, nombre] = raw.split(',').map((p) => p.trim())
  return `${nombre} ${apellido}`
})

const rolPersonaje = computed(() => {
  return personaje.value?.role === 'Main' ? 'MAIN' : 'SUPPORTING'
})

const fotoPersonaje = computed(() => {
  return obtenerImagen(idPersonaje.value)
})

function limpiar() {
  clearInterval(intervalo)
  clearTimeout(corte)
}

async function generar() {
  if (girando.value) return

  if (!personajes.value.length) {
    await obtenerPersonajes()
  }

  const lista = personajes.value
  if (!lista.length) return

  limpiar()
  girando.value = true
  revelado.value = false

  intervalo = setInterval(() => {
    const azar = lista[Math.floor(Math.random() * lista.length)]
    fotoRuleta.value = obtenerImagen(azar?.character?.mal_id)
  }, 85)

  corte = setTimeout(() => {
    limpiar()
    personaje.value = lista[Math.floor(Math.random() * lista.length)]
    girando.value = false
    revelado.value = true
  }, 1800)
}
</script>

<template>
  <section
    aria-labelledby="titulo-random-personaje"
    class="random-seccion-fondo relative min-h-svh md:min-h-0 md:h-[32rem] lg:h-[35rem] w-full overflow-hidden bg-tinta px-6 pt-16 md:pt-10 pb-0 sm:px-8 lg:px-16 text-hueso flex flex-col justify-between"
  >
    <div aria-hidden="true" class="random-overlay pointer-events-none absolute inset-0 z-0"></div>

    <div class="relative z-10 mx-auto w-full max-w-7xl">
      <p
        class="text-center md:text-right font-canon text-xs uppercase tracking-[0.22em] text-hueso/75"
      >
        Ready to discover it?
      </p>
    </div>

    <div
      class="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center md:items-end gap-8 md:gap-5 lg:gap-10 pt-8 md:grid-cols-12"
    >
      <header
        class="flex flex-col items-center text-center md:items-start md:text-left md:self-center space-y-5 px-2 pb-6 md:pb-12 md:col-span-5 md:pl-8 lg:pl-8 xl:pl-12 lg:pb-16"
      >
        <span
          class="inline-block rounded-md border border-rojo-coral/40 bg-bordo-oscuro/60 px-3 py-1 font-rubik text-[0.7rem] font-bold uppercase tracking-[0.18em] text-rojo-coral"
        >
          Random Mode
        </span>

        <h2
          id="titulo-random-personaje"
          class="font-rubik text-4xl sm:text-4xl lg:text-6xl font-extrabold leading-[1.06] tracking-tight text-hueso"
        >
          Your next <br />
          <span class="text-rojo-coral">random</span> <br />
          character.
        </h2>

        <p class="max-w-md font-canon text-sm sm:text-base leading-relaxed text-pergamino/85">
          Let destiny choose for you. Who will you get this time?
        </p>

        <div class="flex flex-col items-center md:items-start space-y-2.5 pt-1">
          <button
            type="button"
            :disabled="girando || cargandoPersonajes"
            class="inline-flex items-center gap-2.5 rounded-lg bg-rojo-coral px-6 py-3.5 font-rubik text-sm font-bold text-hueso transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            @click="generar"
          >
            <span>{{ girando ? 'Rolling...' : 'Generate character' }}</span>
            <span aria-hidden="true">↗</span>
          </button>

          <p class="font-canon text-xs text-pergamino/65">One click. One character. A new story.</p>
        </div>

        <p
          v-if="errorPersonajes"
          role="alert"
          class="rounded-md bg-bordo-oscuro/50 px-3.5 py-2 text-xs text-rojo-coral"
        >
          {{ errorPersonajes }}
        </p>
      </header>

      <!-- Columna derecha -->
      <div
        class="flex w-full items-end justify-center md:justify-center lg:-ml-6 xl:-ml-10 md:col-span-7"
      >
        <!-- Estado inicial -->
        <div v-if="!girando && !revelado" class="random-silueta-borde">
          <img
            :src="siluetaSrc"
            alt="Mysterious character silhouette"
            class="random-silueta-img"
            @error="usarFallback"
          />

          <div class="random-cartel-encima">
            <span>Mysterious Character</span>
          </div>
        </div>

        <!-- Estado activo -->
        <div
          v-else
          aria-live="polite"
          class="mb-10 sm:mb-12 lg:mb-14 flex w-full flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6"
        >
          <div class="random-marco-personaje shrink-0">
            <img
              v-if="girando"
              :src="fotoRuleta"
              alt=""
              aria-hidden="true"
              class="random-silueta-filtro"
              @error="usarFallback"
            />
            <img
              v-else-if="revelado && personaje"
              :src="fotoPersonaje"
              :alt="nombrePersonaje"
              class="random-foto-revelada"
              @error="usarFallback"
            />
          </div>

          <div class="random-ficha-lateral">
            <template v-if="girando">
              <p
                class="font-rubik text-xs font-bold uppercase tracking-[0.2em] text-rojo-coral animate-pulse"
              >
                Selecting character...
              </p>
            </template>

            <template v-else-if="revelado && personaje">
              <h3 class="font-rubik text-xl sm:text-2xl font-extrabold text-hueso leading-tight">
                {{ nombrePersonaje }}
              </h3>

              <p class="font-canon text-xs uppercase tracking-[0.16em] text-pergamino/85">
                ROLE: <span class="font-bold text-rojo-coral">{{ rolPersonaje }}</span>
              </p>

              <RouterLink
                v-if="idPersonaje"
                :to="{ name: 'personaje-detalle', params: { id: idPersonaje } }"
                class="random-btn-ver"
              >
                <span>VIEW CHARACTER</span>
                <span aria-hidden="true">↗</span>
              </RouterLink>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
