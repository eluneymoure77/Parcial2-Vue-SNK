<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  modo: {
    type: String,
    default: 'error-api', 
  },
  varianteVacio: {
    type: String,
    default: 'busqueda', 
  },
  tituloEncabezado: {
    type: String,
    default: '',
  },
  estadoEncabezado: {
    type: String,
    default: 'Connection interrupted',
  },
  etiqueta: {
    type: String,
    default: '',
  },
  imagenSrc: {
    type: String,
    required: true,
  },
  imagenAlt: {
    type: String,
    default: 'Archive status illustration',
  },
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  textoReintentar: {
    type: String,
    default: 'Retry',
  },
  textoReintentando: {
    type: String,
    default: 'Retrying...',
  },
  cargando: {
    type: Boolean,
    default: false,
  },
  textoPrimario: {
    type: String,
    default: '',
  },
  destinoPrimario: {
    type: [String, Object],
    default: null,
  },
  textoSecundario: {
    type: String,
    default: '',
  },
  destinoSecundario: {
    type: [String, Object],
    default: null,
  },
  notaPie: {
    type: String,
    default: '',
  },
})

defineEmits(['reintentar', 'accion-primaria', 'accion-secundaria'])

</script>

<template>
  <div>
    <header
      v-if="modo === 'error-api' && (tituloEncabezado || estadoEncabezado)"
      class="mb-4 flex flex-wrap items-center justify-between gap-2"
    >
      <h3
        v-if="tituloEncabezado"
        class="font-rubik text-base sm:text-lg font-semibold text-hueso"
      >
        {{ tituloEncabezado }}
      </h3>
      <span
        v-if="estadoEncabezado"
        :class="
          estadoEncabezado.trim().toLowerCase() === 'offline'
            ? 'personajes-pill-sin-conexion'
            : 'text-xs text-pergamino/65'
        "
      >
        {{ estadoEncabezado }}
      </span>
    </header>

    <!-- Pantallas de error API -->
    <section
      v-if="modo === 'error-api'"
      aria-live="polite"
      class="personajes-error-conexion"
    >
      <div class="personajes-error-media">
        <img
          :src="imagenSrc"
          :alt="imagenAlt"
          class="personajes-error-img"
        />
      </div>

      <div class="personajes-error-cuerpo">
        <p
          v-if="etiqueta"
          class="text-[11px] font-bold tracking-[0.16em] uppercase text-rojo-coral"
        >
          {{ etiqueta }}
        </p>

        <h4 class="mt-1.5 font-rubik text-xl sm:text-2xl lg:text-[1.85rem] font-extrabold leading-tight text-hueso whitespace-pre-line">
          {{ titulo }}
        </h4>

        <p class="mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-pergamino/75">
          {{ descripcion }}
        </p>

        <button
          type="button"
          :disabled="cargando"
          @click="$emit('reintentar')"
          class="personajes-error-btn"
        >
          <span aria-hidden="true">↻</span>
          <span>{{ cargando ? textoReintentando : textoReintentar }}</span>
        </button>

        <p
          v-if="notaPie"
          class="mt-4 text-[11px] text-pergamino/45"
        >
          {{ notaPie }}
        </p>
      </div>
    </section>

    <!-- Pantalla de Sin resultados -->
    <section
      v-else
      aria-live="polite"
      :class="varianteVacio === 'escuadron' ? 'favoritos-vacio' : 'personajes-sin-resultados'"
    >
      <img
        :src="imagenSrc"
        :alt="imagenAlt"
        :class="varianteVacio === 'escuadron' ? 'favoritos-vacio-img' : 'personajes-sin-resultados-img'"
      />

      <p
        v-if="etiqueta"
        class="text-[11px] font-bold tracking-[0.16em] uppercase text-pergamino/55"
      >
        {{ etiqueta }}
      </p>

      <h4 class="mt-1.5 font-rubik text-xl sm:text-2xl lg:text-[1.75rem] font-extrabold text-hueso whitespace-pre-line">
        {{ titulo }}
      </h4>

      <p class="mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-pergamino/70">
        {{ descripcion }}
      </p>

      <div
        v-if="textoPrimario || textoSecundario"
        :class="varianteVacio === 'escuadron' ? 'favoritos-vacio-acciones' : 'mt-4 flex flex-wrap items-center justify-center gap-3'"
      >
        <RouterLink
          v-if="textoPrimario && destinoPrimario"
          :to="destinoPrimario"
          :class="varianteVacio === 'escuadron' ? 'favoritos-vacio-btn-primario' : 'personajes-sin-resultados-btn !mt-0'"
        >
          {{ textoPrimario }}
        </RouterLink>
        <button
          v-else-if="textoPrimario"
          type="button"
          @click="$emit('accion-primaria')"
          :class="varianteVacio === 'escuadron' ? 'favoritos-vacio-btn-primario' : 'personajes-sin-resultados-btn !mt-0'"
        >
          {{ textoPrimario }}
        </button>

        <RouterLink
          v-if="textoSecundario && destinoSecundario"
          :to="destinoSecundario"
          class="favoritos-vacio-btn-secundario"
        >
          {{ textoSecundario }}
        </RouterLink>
        <button
          v-else-if="textoSecundario"
          type="button"
          @click="$emit('accion-secundaria')"
          class="favoritos-vacio-btn-secundario"
        >
          {{ textoSecundario }}
        </button>
      </div>

      <p
        v-if="notaPie"
        class="mt-4 text-[11px] text-pergamino/45"
      >
        {{ notaPie }}
      </p>
    </section>
  </div>
</template>