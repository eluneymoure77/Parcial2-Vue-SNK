<script setup>
import SectionHeroBanner from '../components/SectionHeroBanner.vue'
import SectionStory from '../components/SectionStory.vue'
import SectionInfo from '../components/SectionInfo.vue'
import SectionRandomPersonaje from '@/components/SectionRandomPersonaje.vue'
import SectionDivisiones from '../components/SectionDivisiones.vue'
import SectionQuiz from '@/components/SectionQuiz.vue'
import { useInstructor } from '../composables/useInstructor.js'

const { consultarDivisionInicial, recomendarSiguienteSeccion } = useInstructor()

</script>

<template>
  <div class="home-vista">
    <SectionHeroBanner
      variant="inicio"
      video-src="/video/banner-video.mp4"
      @abrir-instructor="consultarDivisionInicial"
    />

    <SectionStory
      banner-inferior-src="/img/inicio/eren-tejados.png"
      @abrir-instructor="recomendarSiguienteSeccion"
    />

    <SectionInfo />
    <SectionRandomPersonaje />
    <SectionDivisiones id="section-divisiones" />
    <SectionQuiz id="section-quiz" />
  </div>
</template>
