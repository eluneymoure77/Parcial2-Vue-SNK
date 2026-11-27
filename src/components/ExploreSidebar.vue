<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const divisionsAbierto = ref(false)
const sidebarRef = ref(null)

const opcionesDivisiones = [
  {
    label: 'Garrison Regiment',
    shortLabel: 'Garrison',
    to: { name: 'division-detalle', params: { id: 'garrison' } },
    id: 'garrison',
    icono: 'ri-flower-line',
  },
  {
    label: 'The Survey Corps',
    shortLabel: 'Survey Corps',
    to: { name: 'division-detalle', params: { id: 'survey-corps' } },
    id: 'survey-corps',
    icono: 'ri-sword-line',
  },
  {
    label: 'Military police',
    shortLabel: 'Military Police',
    to: { name: 'division-detalle', params: { id: 'military-police' } },
    id: 'military-police',
    icono: 'ri-vip-crown-line',
  },
]

const esRutaDivisiones = computed(() => {
  return route.name === 'divisiones' || route.name === 'division-detalle'
})

function alternarDivisiones() {
  divisionsAbierto.value = !divisionsAbierto.value
}

function cerrarDivisiones() {
  divisionsAbierto.value = false
}

function manejarClickAfuera(evento) {
  if (sidebarRef.value && !sidebarRef.value.contains(evento.target)) {
    divisionsAbierto.value = false
  }
}

watch(
  () => route.fullPath,
  () => {
    divisionsAbierto.value = false
  }
)

onMounted(() => {
  document.addEventListener('click', manejarClickAfuera)
})

onUnmounted(() => {
  document.removeEventListener('click', manejarClickAfuera)
})
</script>

<template>
  <aside
    ref="sidebarRef"
    aria-label="Explore sections"
    class="w-full min-w-0"
  >
    <nav aria-label="Archive exploration" class="personajes-sidebar !flex-nowrap md:!flex-col">
      <h2 class="personajes-sidebar-titulo">
        EXPLORE
      </h2>

      <RouterLink
        :to="{ name: 'personajes' }"
        class="personajes-sidebar-link"
        active-class="personajes-sidebar-link-activo"
      >
        Characters
      </RouterLink>

      <RouterLink
        :to="{ name: 'manga' }"
        class="personajes-sidebar-link"
        active-class="personajes-sidebar-link-activo"
      >
        Manga
      </RouterLink>

      <!-- Boton Divisions -->
      <div class="relative shrink-0 md:w-full">
        <button
          type="button"
          :aria-expanded="divisionsAbierto"
          aria-haspopup="menu"
          @click="alternarDivisiones"
          :class="[
            'personajes-sidebar-link w-full cursor-pointer justify-between gap-1.5 text-left',
            esRutaDivisiones ? 'personajes-sidebar-link-activo' : '',
          ]"
        >
          <span>Divisions</span>
          <i
            :class="[
              'ri-arrow-down-s-line text-base transition-transform duration-200',
              divisionsAbierto ? 'rotate-180 text-lima-acento' : 'opacity-75',
            ]"
            aria-hidden="true"
          ></i>
        </button>

        <!-- Dropdown vertical Desktop -->
        <div
          v-if="divisionsAbierto"
          role="menu"
          aria-label="Military divisions"
          class="hidden md:flex md:flex-col md:gap-1 md:rounded-xl md:border md:border-pergamino/15 md:bg-[#171a18]/95 md:p-1.5 md:mt-1.5"
        >
          <RouterLink
            v-for="opcion in opcionesDivisiones"
            :key="opcion.id"
            :to="opcion.to"
            role="menuitem"
            @click="cerrarDivisiones"
            :class="[
              'flex items-center gap-2.5 rounded-lg px-3 py-2 font-rubik text-xs sm:text-[0.82rem] font-medium no-underline transition-all duration-200',
              route.name === 'division-detalle' && route.params.id === opcion.id
                ? 'bg-verde-card/35 font-semibold text-lima-acento'
                : 'text-pergamino/80 hover:bg-white/10 hover:text-hueso',
            ]"
          >
            <i :class="[opcion.icono, 'text-sm text-lima-acento/85']" aria-hidden="true"></i>
            <span>{{ opcion.label }}</span>
          </RouterLink>

          <RouterLink
            :to="{ name: 'divisiones' }"
            role="menuitem"
            @click="cerrarDivisiones"
            :class="[
              'mt-0.5 flex items-center justify-between border-t border-pergamino/10 px-3 pt-2 pb-1.5 font-rubik text-[11px] font-semibold uppercase tracking-wider no-underline transition-colors duration-200',
              route.name === 'divisiones'
                ? 'text-lima-acento'
                : 'text-pergamino/55 hover:text-hueso',
            ]"
          >
            <span>All divisions</span>
            <i class="ri-arrow-right-s-line text-sm" aria-hidden="true"></i>
          </RouterLink>
        </div>
      </div>

      <RouterLink
        :to="{ name: 'favoritos' }"
        class="personajes-sidebar-link"
        active-class="personajes-sidebar-link-activo"
      >
        Favorites
      </RouterLink>
    </nav>

    <!-- Mobile -->
    <div
      v-if="divisionsAbierto"
      role="menu"
      aria-label="Military divisions mobile"
      class="mt-2.5 flex items-center gap-2 overflow-x-auto rounded-xl border border-pergamino/12 bg-[#161917] p-2 md:hidden"
    >
      <RouterLink
        v-for="opcion in opcionesDivisiones"
        :key="opcion.id"
        :to="opcion.to"
        role="menuitem"
        @click="cerrarDivisiones"
        :class="[
          'inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 font-rubik text-xs font-medium no-underline transition-all duration-200',
          route.name === 'division-detalle' && route.params.id === opcion.id
            ? 'border-lima-acento/50 bg-verde-card/35 font-semibold text-lima-acento'
            : 'border-pergamino/10 bg-white/5 text-pergamino/85 hover:border-pergamino/25 hover:bg-white/10 hover:text-hueso',
        ]"
      >
        <i :class="[opcion.icono, 'text-xs text-lima-acento']" aria-hidden="true"></i>
        <span>{{ opcion.label }}</span>
      </RouterLink>

      <RouterLink
        :to="{ name: 'divisiones' }"
        role="menuitem"
        @click="cerrarDivisiones"
        :class="[
          'inline-flex shrink-0 items-center gap-1 rounded-lg border px-2.5 py-1.5 font-rubik text-[11px] font-semibold uppercase tracking-wider no-underline transition-colors duration-200',
          route.name === 'divisiones'
            ? 'border-lima-acento/50 bg-lima-acento/15 text-lima-acento'
            : 'border-pergamino/10 text-pergamino/65 hover:text-hueso',
        ]"
      >
        <span>All</span>
        <i class="ri-arrow-right-s-line text-sm" aria-hidden="true"></i>
      </RouterLink>
    </div>
  </aside>
</template>