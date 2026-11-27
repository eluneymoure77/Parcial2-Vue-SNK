<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

defineProps({
  logoSrc: {
    type: String,
    default: '../img/logo-snk.png',
  },
})

const emit = defineEmits(['accion-boton'])

const menuAbierto = ref(false)
const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    menuAbierto.value = false
  },
)

function alternarMenu() {
  menuAbierto.value = !menuAbierto.value
}
</script>

<template>
  <header class="navbar-header">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-6">
      <RouterLink to="/" class="inline-flex shrink-0 items-center" aria-label="Ir al inicio">
        <img
          :src="logoSrc"
          alt="Attack on Titan"
          class="block h-9 w-auto object-contain sm:h-11 md:h-12"
        />
      </RouterLink>

      <button
        type="button"
        class="relative z-50 inline-flex h-10.5 w-10.5 flex-col items-center justify-center gap-1.25 rounded-md border border-hueso/20 bg-[#140b0a]/65 cursor-pointer md:hidden"
        :aria-expanded="menuAbierto"
        aria-label="Abrir o cerrar menú de navegación"
        @click="alternarMenu"
      >
        <span
          class="block h-0.5 w-5 rounded-xs bg-hueso transition-transform duration-200"
          :class="{ 'translate-y-1.75 rotate-45': menuAbierto }"
        ></span>
        <span
          class="block h-0.5 w-5 rounded-xs bg-hueso transition-opacity duration-200"
          :class="{ 'opacity-0': menuAbierto }"
        ></span>
        <span
          class="block h-0.5 w-5 rounded-xs bg-hueso transition-transform duration-200"
          :class="{ '-translate-y-1.75 -rotate-45': menuAbierto }"
        ></span>
      </button>

      <nav
        aria-label="Navegación principal"
        class="fixed top-0 right-0 z-40 flex h-svh w-[min(80vw,320px)] flex-col items-start justify-center gap-8 border-l border-hueso/10 bg-[#120a09]/95 p-8 transition-transform duration-300 ease-out md:static md:z-auto md:h-auto md:w-auto md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0 md:translate-x-0"
        :class="menuAbierto ? 'translate-x-0' : 'translate-x-full'"
      >
        <ul class="flex w-full flex-col items-start gap-5 md:w-auto md:flex-row md:items-center md:gap-7">
          <li>
            <RouterLink to="/" exact-active-class="activo" class="nav-link">Home</RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'personajes' }" active-class="activo" class="nav-link">
              Characters
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'manga' }" active-class="activo" class="nav-link">
              Manga
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'divisiones' }" active-class="activo" class="nav-link">
              Divisions
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'favoritos' }" active-class="activo" class="nav-link">
              Favorites
            </RouterLink>
          </li>
        </ul>

        <RouterLink
          :to="{ name: 'home', hash: '#section-divisiones' }"
          class="nav-cta inline-flex items-center justify-center no-underline"
        >
          Join the Corps
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
