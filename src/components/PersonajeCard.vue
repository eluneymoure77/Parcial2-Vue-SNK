<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const FALLBACK_IMG = '/img/personajes/fallback.png'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  imagenSrc: {
    type: String,
    default: '',
  },
  descripcion: {
    type: String,
    default: '',
  },
  esFavorito: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle-favorito', 'error-imagen'])

const idPersonaje = computed(() => props.item?.character?.mal_id ?? '')

const nombreFormateado = computed(() => {
  const rawName = props.item?.character?.name || 'Unknown'
  if (!rawName.includes(',')) return rawName
  const [apellido, nombre] = rawName.split(',').map((parte) => parte.trim())
  return `${nombre} ${apellido}`
})

const imagenPersonaje = computed(() => {
  return (
    props.imagenSrc ||
    props.item?.character?.images?.webp?.image_url ||
    props.item?.character?.images?.jpg?.image_url ||
    FALLBACK_IMG
  )
})

const rolTexto = computed(() => {
  return props.item?.role === 'Main' ? 'Main' : 'Supporting'
})

const descripcionResumida = computed(() => {
  const texto =
    props.descripcion?.trim() ||
    (props.item?.role === 'Main'
      ? `${nombreFormateado.value} plays a key role in Attack on Titan.`
      : `${nombreFormateado.value} appears in the Attack on Titan archive.`)

  const limite = 115
  if (texto.length <= limite) return texto
  return `${texto.slice(0, limite).trim()}...`
})

function manejarFavorito() {
  if (!idPersonaje.value) return
  emit('toggle-favorito', idPersonaje.value)
}

function manejarErrorImagen(event) {
  emit('error-imagen', event)
}
</script>

<template>
  <article class="snk-card">
    <div class="snk-card-cabecera">
      <img
        v-if="imagenPersonaje"
        :src="imagenPersonaje"
        :alt="nombreFormateado"
        loading="lazy"
        class="relative z-1 block h-full w-full object-cover object-top"
        @error="manejarErrorImagen"
      />

      <button
        type="button"
        :aria-label="
          esFavorito
            ? `Remove ${nombreFormateado} from favorites`
            : `Save ${nombreFormateado} to favorites`
        "
        :aria-pressed="esFavorito"
        class="absolute top-2 right-2 z-2 flex h-7.5 w-7.5 items-center justify-center rounded-full text-[0.9rem] cursor-pointer transition-colors duration-200"
        :class="
          esFavorito
            ? 'bg-lima-acento text-carbon'
            : 'bg-carbon text-pergamino hover:bg-carbon/80'
        "
        @click="manejarFavorito"
      >
        <span aria-hidden="true">{{ esFavorito ? '♥' : '♡' }}</span>
      </button>
    </div>

    <div class="flex grow flex-col px-0.5 pb-0.5">
      <div class="mb-2 flex items-center justify-between gap-1.5">
        <span class="rounded-md bg-verde-pizarra px-2 py-0.5 text-[0.7rem] font-semibold text-pergamino">
          {{ rolTexto }}
        </span>
        <span class="text-[0.62rem] font-bold tracking-[0.08em] text-verde-claro">
          CHARACTER
        </span>
      </div>

      <h3 class="mb-2 truncate text-[1.05rem] font-bold leading-[1.2] text-pergamino">
        {{ nombreFormateado }}
      </h3>

      <hr class="mb-2 border-t border-verde-pizarra" />

      <p class="mb-3.5 grow text-[0.78rem] leading-[1.35] text-pergamino/85 line-clamp-2">
        {{ descripcionResumida }}
      </p>

      <RouterLink
        :to="{ name: 'personaje-detalle', params: { id: idPersonaje } }"
        class="snk-card-boton"
      >
        <span>View character</span>
        <span aria-hidden="true">↗</span>
      </RouterLink>
    </div>
  </article>
</template>
