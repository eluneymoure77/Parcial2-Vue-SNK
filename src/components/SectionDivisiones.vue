<script setup>
import TarjetaDivision from './TarjetaDivision.vue'
import { useDivisiones } from '../composables/useDivisiones.js'

const {
  divisions,
  indiceActual,
  divisionActiva,
  seleccionarDivision,
  siguienteDivision,
  anteriorDivision,
  irAQuiz,
  manejarTouchStart,
  manejarTouchEnd,
} = useDivisiones()

</script>

<template>
  <section
    id="section-divisiones"
    aria-labelledby="titulo-divisiones"
    :class="['section-divisiones-bg', `section-divisiones--${divisionActiva.id}`]"
    class="relative min-h-screen w-full flex flex-col items-center justify-center py-16 px-4 bg-cover bg-center transition-all duration-700 overflow-hidden"
  >
    <header class="text-center max-w-2xl mb-10 z-10">
      <h2 id="titulo-divisiones" class="text-3xl md:text-5xl font-fell font-bold text-white tracking-wide">
        Choose your <span class="text-[#3ca374] italic">division</span>
      </h2>
      <p class="text-gray-300 text-sm md:text-base mt-3 leading-relaxed">
        In this war, no one fights alone. Every recruit dedicates their heart to a branch. Which one
        will you devote yourself to?
      </p>
    </header>

    <!-- Contenedor del Carrusel -->
    <div
      role="region"
      aria-label="Military divisions carousel"
      @touchstart.passive="manejarTouchStart"
      @touchend.passive="manejarTouchEnd"
      class="relative w-full max-w-5xl flex items-center justify-center gap-2 sm:gap-4 z-10"
    >
      <!-- Flecha Izquierda -->
      <button
        type="button"
        @click="anteriorDivision"
        aria-label="División anterior"
        class="hidden min-[770px]:flex w-11 h-11 shrink-0 rounded-full border border-white/25 bg-[#121518]/85 hover:bg-[#1e242b] text-white items-center justify-center text-xl transition cursor-pointer"
      >
        <i class="ri-arrow-left-s-line" aria-hidden="true"></i>
      </button>

      <!-- Contenedor principal de la tarjeta activa -->
      <div class="w-full flex-1 min-w-0">
        <TarjetaDivision :division="divisionActiva" />
      </div>

      <!-- Flecha Derecha -->
      <button
        type="button"
        @click="siguienteDivision"
        aria-label="Siguiente división"
        class="hidden min-[770px]:flex w-11 h-11 shrink-0 rounded-full border border-white/25 bg-[#121518]/85 hover:bg-[#1e242b] text-white items-center justify-center text-xl transition cursor-pointer"
      >
        <i class="ri-arrow-right-s-line" aria-hidden="true"></i>
      </button>
    </div>

    <!-- Indicadores (Puntitos) -->
    <div role="group" aria-label="Select division" class="flex gap-3 mt-6 z-10">
      <button
        v-for="(div, index) in divisions"
        :key="div.id"
        type="button"
        :aria-label="`Select ${div.nombre}`"
        :aria-pressed="indiceActual === index"
        @click="seleccionarDivision(index)"
        class="h-2.5 rounded-full transition-all cursor-pointer"
        :class="indiceActual === index ? 'w-8 bg-[#3ca374]' : 'w-2.5 bg-white/30 hover:bg-white/60'"
      ></button>
    </div>

    <!-- Botón Inferior  -->
    <div class="mt-8 text-center z-10">
      <button
        type="button"
        @click="irAQuiz"
        class="bg-[#3ca374] hover:bg-[#328a62] text-black font-bold text-xs md:text-sm uppercase tracking-wider px-6 py-3 rounded-md inline-flex items-center gap-2 transition cursor-pointer shadow-lg"
      >
        <span>DISCOVER MY DIVISION</span>
        <i class="ri-arrow-right-up-line text-base" aria-hidden="true"></i>
      </button>
      <p class="text-gray-400 text-xs mt-2">
        *Answer a few questions and the instructor will assign you one.
      </p>
    </div>
  </section>
</template>
