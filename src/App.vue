<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterView } from 'vue-router'
import Navbar from './components/SiteNavbar.vue'
import Footer from './components/SiteFooter.vue'
import Instructor from './components/Instructor.vue'
import { divisions } from './data/divisions.js'

const personajes = ref([])

onMounted(async () => {
  try {
    const resp = await fetch('/data/personajes.json')
    const data = await resp.json()
    personajes.value = Array.isArray(data) ? data : data.personajes || []
  } catch (error) {
    console.error('Could not load personajes.json:', error)
  }
})

const contexto = computed(() => {
  const infoDivisiones = divisions.map((d) => ({
    division: `${d.nombre} (${d.nombreEn})`,
    lema: d.subtitulo,
    rol: d.descripcion,
    miembros: d.miembros.map(m => m.nombre),
  }))
  const infoPersonajes = personajes.value.map((p) => ({ nombre: p.nombre, about: p.about }))
  return JSON.stringify({ divisiones: infoDivisiones, personajes: infoPersonajes })
})

</script>

<template>
  <div class="flex min-h-svh flex-col">
    <Navbar logo-src="/img/logo-snk.png" />
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="vista-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <Instructor :contexto="contexto" />
    <Footer logo-src="/img/logo-snk.png" />
  </div>
</template>
