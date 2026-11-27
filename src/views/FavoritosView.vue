<script setup>
import { computed, onMounted } from 'vue'
import SectionHeroBanner from '../components/SectionHeroBanner.vue'
import ExploreSidebar from '../components/ExploreSidebar.vue'
import PersonajeCard from '../components/PersonajeCard.vue'
import PantallaBug from '../components/PantallaBug.vue'
import { useFavoritos } from '../composables/useFavoritos.js'
import { usePersonajes } from '../composables/usePersonajes.js'
import { useSnkApi } from '../composables/useSnkApi.js'
import { VISTAS_CONFIG } from '../data/vistasConfig.js'

defineProps({
  videoSrc: {
    type: String,
    default: '/video/banner-video.mp4',
  },
})

const { personajes, cargandoPersonajes, errorPersonajes, obtenerPersonajes } = useSnkApi()
const { obtenerImagen, obtenerDescripcion, usarFallback } = usePersonajes()
const { favoritosIds, toggleFavorito, vaciarFavoritos } = useFavoritos()

onMounted(() => {
  if (!personajes.value.length) {
    obtenerPersonajes()
  }
})

const personajesFavoritos = computed(() => {
  if (!Array.isArray(favoritosIds.value) || favoritosIds.value.length === 0) {
    return []
  }

  return favoritosIds.value
    .map((idFav) =>
      personajes.value.find(
        (item) => Number(item?.character?.mal_id) === Number(idFav)
      )
    )
    .filter(Boolean)
})

</script>

<template>
  <div class="min-h-svh bg-carbon text-pergamino">
    <SectionHeroBanner variant="seccion" :video-src="videoSrc" v-bind="VISTAS_CONFIG.favoritos.banner" />

    <div class="personajes-layout">
      <ExploreSidebar />

      <div class="min-w-0 flex-1">
        <header class="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="flex items-center gap-2 font-rubik text-2xl sm:text-3xl font-bold text-hueso">
              <span>Favorites</span>
              <i class="ri-heart-fill" aria-hidden="true"></i>
            </h2>
            <p class="mt-1 text-xs sm:text-sm text-pergamino/75">
              Your lineup, always at hand.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <span v-if="errorPersonajes" class="personajes-pill-sin-conexion">
              Offline
            </span>
            <span v-else class="rounded-md bg-verde-pizarra px-3 py-1 text-xs sm:text-sm font-semibold text-pergamino">
              {{ personajesFavoritos.length }} {{ personajesFavoritos.length === 1 ? 'favorite' : 'favorites' }}
            </span>

            <button type="button" :disabled="personajesFavoritos.length === 0" @click="vaciarFavoritos"
              class="favoritos-btn-vaciar">
              Clear squad
            </button>
          </div>
        </header>

        <PantallaBug v-if="errorPersonajes" v-bind="VISTAS_CONFIG.favoritos.errorConexion"
          :cargando="cargandoPersonajes" @reintentar="obtenerPersonajes" />

        <p v-else-if="cargandoPersonajes && personajes.length === 0" class="py-10 text-center text-pergamino/80">
          Loading your squad...
        </p>

        <PantallaBug v-else-if="personajesFavoritos.length === 0" v-bind="VISTAS_CONFIG.favoritos.escuadronVacio" />

        <section v-else aria-label="Your lineup">
          <header class="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 class="font-rubik text-base sm:text-lg font-semibold text-hueso">
              Your lineup
            </h3>
            <span class="text-xs text-pergamino/65">
              {{ personajesFavoritos.length }} {{ personajesFavoritos.length === 1 ? 'recruit' : 'recruits' }} saved
            </span>
          </header>

          <TransitionGroup name="favorito" tag="div" class="personajes-grid">
            <PersonajeCard v-for="item in personajesFavoritos" :key="item.character.mal_id" :item="item"
              :imagen-src="obtenerImagen(item.character.mal_id)"
              :descripcion="obtenerDescripcion(item.character.mal_id)" :es-favorito="true"
              @toggle-favorito="toggleFavorito" @error-imagen="usarFallback" />
          </TransitionGroup>
        </section>
      </div>
    </div>
  </div>
</template>
