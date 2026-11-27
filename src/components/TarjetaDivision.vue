<script setup>
import { RouterLink } from 'vue-router'
import { usarAudio } from '../composables/usarAudio.js'
import { usePersonajes } from '../composables/usePersonajes.js'
import { useDivisiones, useTarjetaDivision } from '../composables/useDivisiones.js'

const props = defineProps({
  division: {
    type: Object,
    required: true,
  },
})

const { estaSonando, cancionActiva, cambiarMusica } = usarAudio()
const { obtenerImagen, usarFallback } = usePersonajes()
const { ocultarSiFalla } = useDivisiones()
const { vistaActual, fondoTarjetaActual } = useTarjetaDivision(() => props.division)

</script>

<template>
  <article
    class="tarjeta-division-fondo relative w-full rounded-none min-[770px]:rounded-2xl overflow-hidden shadow-2xl border-y min-[770px]:border border-white/15 flex flex-col min-[770px]:flex-row min-h-[470px]"
    :class="`division-${division.id}`"
  >
    <!-- Fondo tarjeta -->
    <div
      v-if="fondoTarjetaActual"
      aria-hidden="true"
      class="fondo-imagen-tarjeta pointer-events-none select-none absolute inset-0 bg-cover bg-center z-0"
      :style="{ backgroundImage: `url(${fondoTarjetaActual})` }"
    ></div>

    <!-- Barra lateral -->
    <aside
      aria-label="Division card controls"
      class="w-full min-[770px]:w-20 shrink-0 bg-[#121518]/95 border-b min-[770px]:border-b-0 min-[770px]:border-r border-white/10 grid grid-cols-[auto_1fr_auto] min-[770px]:flex min-[770px]:flex-col items-center gap-2 sm:gap-3 px-3.5 py-2.5 sm:px-6 sm:py-3 min-[770px]:px-0 min-[770px]:py-5 min-[770px]:justify-between z-30"
    >
      <!-- Escudo -->
      <div
        class="w-10 h-10 min-[770px]:w-11 min-[770px]:h-11 shrink-0 rounded-lg bg-white/5 border border-white/15 p-1.5 flex items-center justify-center"
      >
        <img
          :src="division.escudo"
          :alt="`${division.nombre} emblem`"
          @error="ocultarSiFalla"
          class="max-w-full max-h-full object-contain"
        />
      </div>

      <!-- Botones -->
      <div
        class="flex flex-row min-[770px]:flex-col items-center justify-center gap-2 min-[770px]:gap-3 shrink-0"
      >
        <button
          type="button"
          @click="vistaActual = 'principal'"
          title="Division Info"
          aria-label="Division Info"
          :aria-pressed="vistaActual === 'principal'"
          class="boton-sidebar-desktop w-9 h-9 min-[770px]:w-10 min-[770px]:h-10 shrink-0 rounded-lg flex items-center justify-center border text-base min-[770px]:text-lg transition cursor-pointer"
          :class="
            vistaActual === 'principal'
              ? 'bg-[#e0533c] border-[#ff7c66] text-white shadow-md'
              : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
          "
        >
          <i class="ri-shield-line" aria-hidden="true"></i>
        </button>

        <button
          type="button"
          @click="vistaActual = 'miembros'"
          title="Division Members"
          aria-label="Division Members"
          :aria-pressed="vistaActual === 'miembros'"
          class="boton-sidebar-desktop w-9 h-9 min-[770px]:w-10 min-[770px]:h-10 shrink-0 rounded-lg flex items-center justify-center border text-base min-[770px]:text-lg transition cursor-pointer"
          :class="
            vistaActual === 'miembros'
              ? 'bg-[#e0533c] border-[#ff7c66] text-white shadow-md'
              : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
          "
        >
          <i class="ri-group-line" aria-hidden="true"></i>
        </button>
      </div>

      <RouterLink
        :to="{ name: 'division-detalle', params: { id: division.id } }"
        class="hidden min-[381px]:flex min-[770px]:hidden items-center gap-1.5 px-3 py-2 rounded-full border border-white/25 bg-white/5 hover:bg-[#3ca374] hover:border-[#3ca374] hover:text-black text-white text-xs font-semibold whitespace-nowrap transition-all duration-300 shrink-0"
      >
        <span>{{ division.textoBoton }}</span>
        <i class="ri-arrow-right-up-line text-sm" aria-hidden="true"></i>
      </RouterLink>

      <div aria-hidden="true" class="w-9 shrink-0 min-[381px]:hidden"></div>
    </aside>

    <!-- Contenido de Tarjeta -->
    <div class="relative z-10 flex-1 flex flex-col justify-end overflow-hidden">
      <span
        aria-hidden="true"
        class="pointer-events-none select-none absolute bottom-2 right-5 text-6xl min-[770px]:text-8xl font-black text-white/10 z-0"
      >
        {{ division.kanji }}
      </span>


      <!-- VISTA 1: PRINCIPAL -->

      <div
        v-if="vistaActual === 'principal'"
        class="relative flex-1 flex flex-col justify-between min-h-[540px] min-[770px]:min-h-[445px]"
      >

        <!-- DISEÑO MOBILE -->

        <div class="flex min-[770px]:hidden flex-col justify-between flex-1 pt-5">
          <div class="relative z-20 px-3 sm:px-6 flex items-start justify-between gap-2">
            <header class="space-y-1 min-w-0 flex-1">
              <div
                class="flex items-start gap-1.5 text-emerald-200 font-semibold text-xs sm:text-base leading-tight"
              >
                <span>{{ division.nombre }}</span>
                <i class="ri-sword-line shrink-0 mt-0.5" aria-hidden="true"></i>
              </div>

              <div>
                <p
                  class="text-[10px] sm:text-[11px] uppercase tracking-widest text-white/75 font-semibold"
                >
                  LEADER
                </p>
                <h3
                  class="titulo-lider-mobile text-2xl sm:text-4xl font-black text-white uppercase italic leading-[0.95] mt-0.5"
                >
                  {{ division.lider }}
                </h3>
              </div>
            </header>

            <!-- Reproductor -->
            <section
              aria-label="Division soundtrack player"
              class="reproductor-mobile-compacto w-36 sm:w-44 shrink-0 bg-[#121518]/95 border border-white/15 rounded-xl px-2.5 sm:px-3 py-2 text-center shadow-lg"
            >
              <p class="text-[9px] uppercase tracking-widest text-[#e0533c] font-bold">
                {{
                  estaSonando && cancionActiva === division.cancion.titulo
                    ? 'PLAYING TRACK'
                    : 'SOUNDTRACK'
                }}
              </p>
              <p class="text-[11px] text-white font-semibold truncate mt-0.5">
                {{ division.cancion.titulo }}
              </p>

              <div class="flex items-center justify-center gap-2.5 mt-1.5">
                <i class="ri-skip-back-fill text-gray-500 text-xs" aria-hidden="true"></i>
                <button
                  type="button"
                  @click="cambiarMusica(division.cancion.archivo, division.cancion.titulo)"
                  class="w-6 h-6 shrink-0 rounded-full bg-[#e0533c] hover:bg-[#ff6a52] text-white flex items-center justify-center text-xs transition cursor-pointer"
                  :aria-label="
                    estaSonando && cancionActiva === division.cancion.titulo
                      ? 'Pause music'
                      : 'Play music'
                  "
                >
                  <i
                    v-if="estaSonando && cancionActiva === division.cancion.titulo"
                    class="ri-pause-fill"
                    aria-hidden="true"
                  ></i>
                  <i v-else class="ri-play-fill ml-0.5" aria-hidden="true"></i>
                </button>
                <i class="ri-skip-forward-fill text-gray-500 text-xs" aria-hidden="true"></i>
              </div>
            </section>
          </div>

          <!-- Escudo, lider y descripcion -->
          <div
            class="relative flex-1 flex items-end justify-center min-h-[290px] sm:min-h-[320px] mt-2"
          >
            <div
              class="pointer-events-none select-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[310px] sm:w-[360px] h-[290px] sm:h-[320px] flex items-end justify-center z-10"
            >
              <img
                :src="division.escudo"
                alt=""
                aria-hidden="true"
                @error="ocultarSiFalla"
                class="escudo-fondo"
                :class="`escudo-${division.id}`"
              />
              <img
                :src="division.imgTarjetaCerca"
                :alt="division.lider"
                @error="ocultarSiFalla"
                class="foto-lider-cerca"
              />
            </div>

            <div class="relative z-20 w-full px-3 sm:px-6 pb-4">
              <p
                class="bg-[#121518]/92 border border-white/15 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm text-gray-100 leading-relaxed shadow-xl"
              >
                <strong class="text-white">{{ division.nombre }}:</strong>
                {{ division.descripcion }}
              </p>
            </div>
          </div>

          <!-- Rectangulo negro con valores -->
          <section
            aria-label="Division statistics"
            class="relative z-20 bg-[#121518] border-t border-white/10 p-3.5 sm:p-4"
          >
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="(stat, index) in division.stats"
                :key="`mobile-${stat.titulo}`"
                class="bg-[#181c21] border-l-4 rounded-lg px-3.5 py-2.5 flex items-center justify-between gap-2.5 shadow-md"
                :style="{ borderLeftColor: stat.color }"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <i
                    class="text-lg shrink-0"
                    :class="[stat.icono, index === 0 ? 'text-[#3ca374]' : 'text-amber-400']"
                    aria-hidden="true"
                  ></i>
                  <div class="min-w-0">
                    <p class="text-xs font-extrabold text-white uppercase tracking-wider truncate">
                      {{ stat.titulo }}
                    </p>
                    <p class="text-[11px] text-gray-400 truncate">
                      {{ stat.subtitulo }}
                    </p>
                  </div>
                </div>

                <span
                  class="text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0"
                  :style="{ backgroundColor: stat.fondoBadge, color: stat.color }"
                >
                  {{ stat.nivel }}
                </span>
              </div>
            </div>

            <!-- Botón Explore mobile -->
            <div class="flex min-[381px]:hidden mt-3">
              <RouterLink
                :to="{ name: 'division-detalle', params: { id: division.id } }"
                class="w-full py-2.5 px-4 rounded-xl border border-white/20 bg-[#181c21] hover:bg-[#3ca374] hover:border-[#3ca374] hover:text-black text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300"
              >
                <span>{{ division.textoBoton }}</span>
                <i class="ri-arrow-right-up-line text-sm" aria-hidden="true"></i>
              </RouterLink>
            </div>
          </section>
        </div>

        <!--DISEÑO DESKTOP  -->

        <div
          class="hidden min-[770px]:flex relative flex-1 flex-col justify-between min-h-[445px] px-6 min-[1024px]:px-8 pt-6 min-[1024px]:pt-8"
        >
          <!-- Escudo y Lider -->
          <div
            class="pointer-events-none select-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[360px] min-[1024px]:w-[440px] h-[440px] min-[1024px]:h-[475px] flex items-end justify-center z-10"
          >
            <img
              :src="division.escudo"
              alt=""
              aria-hidden="true"
              @error="ocultarSiFalla"
              class="escudo-fondo"
              :class="`escudo-${division.id}`"
            />
            <img
              :src="division.imgTarjetaCerca"
              :alt="division.lider"
              @error="ocultarSiFalla"
              class="foto-lider-cerca"
            />
          </div>

          <div
            class="relative z-20 grid grid-cols-12 gap-4 min-[1024px]:gap-5 items-start my-auto pb-8"
          >
            <div class="col-span-5 space-y-4">
              <div
                class="flex items-center gap-2 text-emerald-200 font-semibold text-base min-[1024px]:text-lg"
              >
                <span>{{ division.nombre }}</span>
                <i class="ri-sword-line" aria-hidden="true"></i>
              </div>

              <div>
                <p class="text-xs uppercase tracking-widest text-white/75 font-semibold">LEADER</p>
                <h3
                  class="text-4xl min-[1024px]:text-5xl font-black text-white uppercase italic leading-none mt-1"
                >
                  {{ division.lider }}
                </h3>
              </div>

              <p
                class="rectangulo-info-desktop bg-[#121518]/90 border border-white/10 rounded-xl p-4 text-xs min-[1024px]:text-sm text-gray-200 leading-relaxed shadow-lg"
              >
                <strong class="text-white">{{ division.nombre }}:</strong>
                {{ division.descripcion }}
              </p>
            </div>

            <div aria-hidden="true" class="col-span-3"></div>

            <!-- Reproductor musica -->
            <div class="col-span-4 flex flex-col gap-3.5">
              <section
                aria-label="Division soundtrack player"
                class="rectangulo-info-desktop bg-[#121518]/95 border border-white/15 rounded-xl px-4 py-3 text-center shadow-lg"
              >
                <p class="text-[10px] uppercase tracking-widest text-[#e0533c] font-bold">
                  {{
                    estaSonando && cancionActiva === division.cancion.titulo
                      ? 'PLAYING TRACK'
                      : 'SOUNDTRACK'
                  }}
                </p>
                <p class="text-xs text-white font-medium truncate mt-0.5">
                  {{ division.cancion.titulo }}
                </p>

                <div class="flex items-center justify-center gap-3 mt-2">
                  <i class="ri-skip-back-fill text-gray-500 text-sm" aria-hidden="true"></i>
                  <button
                    type="button"
                    @click="cambiarMusica(division.cancion.archivo, division.cancion.titulo)"
                    class="w-7 h-7 shrink-0 rounded-full bg-[#e0533c] hover:bg-[#ff6a52] text-white flex items-center justify-center text-sm transition cursor-pointer"
                    :aria-label="
                      estaSonando && cancionActiva === division.cancion.titulo
                        ? 'Pause music'
                        : 'Play music'
                    "
                  >
                    <i
                      v-if="estaSonando && cancionActiva === division.cancion.titulo"
                      class="ri-pause-fill"
                      aria-hidden="true"
                    ></i>
                    <i v-else class="ri-play-fill ml-0.5" aria-hidden="true"></i>
                  </button>
                  <i class="ri-skip-forward-fill text-gray-500 text-sm" aria-hidden="true"></i>
                </div>
              </section>

              <div class="space-y-3">
                <div
                  v-for="(stat, index) in division.stats"
                  :key="stat.titulo"
                  class="rectangulo-info-desktop bg-[#121518]/95 border-l-4 rounded-lg px-4 py-3 flex items-center justify-between gap-3 shadow-lg"
                  :style="{ borderLeftColor: stat.color }"
                >
                  <div class="flex items-center gap-2.5 min-w-0">
                    <i
                      class="text-lg shrink-0"
                      :class="[stat.icono, index === 0 ? 'text-[#3ca374]' : 'text-amber-400']"
                      aria-hidden="true"
                    ></i>
                    <div class="min-w-0">
                      <p class="text-xs font-extrabold text-white tracking-wider">
                        {{ stat.titulo }}
                      </p>
                      <p class="text-[11px] text-gray-400 whitespace-nowrap mt-0.5">
                        {{ stat.subtitulo }}
                      </p>
                    </div>
                  </div>

                  <span
                    class="text-[10px] font-bold px-2.5 py-1 rounded uppercase shrink-0"
                    :style="{ backgroundColor: stat.fondoBadge, color: stat.color }"
                  >
                    {{ stat.nivel }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Botón "+" -->
          <div class="hidden min-[770px]:flex items-center group absolute bottom-5 left-4 z-40">
            <button
              type="button"
              :aria-label="division.textoBoton"
              class="boton-sidebar-desktop w-10 h-10 shrink-0 rounded-full border border-white/30 bg-[#121518]/85 group-hover:bg-[#3ca374] group-hover:border-[#3ca374] group-hover:text-black text-white flex items-center justify-center text-xl shadow-xl cursor-pointer"
            >
              <i class="ri-add-line" aria-hidden="true"></i>
            </button>

            <RouterLink
              :to="{ name: 'division-detalle', params: { id: division.id } }"
              class="pointer-events-none opacity-0 -translate-x-3 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-x-0 ml-2.5 px-4 py-2 rounded-full border border-white/25 bg-[#121518]/95 hover:bg-[#1d2227] text-white text-xs font-semibold whitespace-nowrap inline-flex items-center gap-2 shadow-xl transition-all duration-300"
            >
              <span>{{ division.textoBoton }}</span>
              <i class="ri-arrow-right-up-line text-sm" aria-hidden="true"></i>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- VISTA 2: MIEMBROS  -->
           
      <section
        v-else
        :aria-label="`${division.nombre} members`"
        class="relative flex-1 flex flex-col justify-between min-h-[445px]"
      >
        <div
          class="flex-1 grid grid-cols-1 min-[1024px]:grid-cols-12 gap-6 items-end px-3.5 sm:px-6 pt-5 min-[770px]:px-6 min-[1024px]:px-8 min-[770px]:pt-6 min-[1024px]:pt-8"
        >
          <!-- Escudo y Lider -->
          <div
            class="hidden min-[1024px]:flex min-[1024px]:col-span-4 relative items-end justify-center h-[445px] self-end z-10"
          >
            <img
              :src="division.escudo"
              alt=""
              aria-hidden="true"
              @error="ocultarSiFalla"
              class="escudo-fondo escudo-miembros"
              :class="`escudo-${division.id}`"
            />
            <img
              :src="division.imgTarjetaLejos"
              :alt="division.lider"
              @error="ocultarSiFalla"
              class="foto-lider-lejos"
            />
          </div>

          <!-- Tarjetas miembros -->
          <div
            class="min-[1024px]:col-span-8 flex flex-col justify-center self-center pb-5 min-[770px]:pb-8 z-20 min-w-0"
          >
            <header class="flex items-baseline gap-4 mb-3">
              <h3 class="text-3xl min-[770px]:text-5xl font-black italic text-white uppercase">
                MEMBERS
              </h3>
              <span
                aria-hidden="true"
                class="text-xl min-[770px]:text-2xl font-bold text-white/25"
              >
                {{ division.kanji }}
              </span>
            </header>

            <!-- Contenedor nombre y tarjetas -->
            <div class="lista-miembros-scroll overflow-x-auto pb-3">
              <div class="flex flex-col gap-2.5 min-w-full w-max">
                <div class="flex gap-3">
                  <div
                    v-for="persona in division.integrantes"
                    :key="`nombre-${persona.nombre}`"
                    class="min-w-[145px] flex-1 py-1.5 px-2.5 rounded-md text-center text-xs font-bold italic truncate border transition-colors"
                    :class="
                      persona.destacado
                        ? 'bg-[#a3e635] text-black border-[#bef264]'
                        : 'bg-[#121518]/90 text-white border-white/15'
                    "
                  >
                    {{ persona.nombre }}
                  </div>
                </div>

                <!-- Fila de tarjetas de cada integrante -->
                <div class="flex gap-3">
                  <article
                    v-for="persona in division.integrantes"
                    :key="`card-${persona.nombre}`"
                    class="rectangulo-info-desktop min-w-[145px] flex-1 flex flex-col rounded-lg overflow-hidden border border-white/15 bg-[#121518]/90"
                  >
                    <div
                      class="fondo-cara-miembro h-32 w-full overflow-hidden"
                      :class="`division-${division.id}`"
                    >
                      <img
                        :src="obtenerImagen(persona.id)"
                        :alt="persona.nombre"
                        @error="usarFallback"
                        class="w-full h-full object-cover object-top"
                      />
                    </div>

                    <div class="p-3 flex flex-col items-center text-center space-y-2 bg-[#15181c]">
                      <div class="w-full">
                        <p class="text-[9px] uppercase tracking-widest text-gray-400">POWER</p>
                        <div
                          class="flex items-center justify-center gap-1.5 text-lg font-black text-[#a3e635]"
                        >
                          <i class="ri-sword-fill text-xs text-sky-400" aria-hidden="true"></i>
                          <span>{{ persona.poder }}</span>
                        </div>
                      </div>

                      <div class="w-full border-t border-white/10 pt-1.5">
                        <p class="text-[9px] uppercase tracking-widest text-gray-400">VITALITY</p>
                        <div
                          class="flex items-center justify-center gap-1.5 text-lg font-black text-[#a3e635]"
                        >
                          <i class="ri-heart-fill text-xs text-red-500" aria-hidden="true"></i>
                          <span>{{ persona.vitalidad }}</span>
                        </div>
                      </div>

                      <p class="text-[10px] font-bold uppercase text-gray-200 pt-1 leading-tight">
                        {{ persona.rango }}
                      </p>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Rectángulo negro para mobile -->
        <div
          class="flex min-[381px]:hidden relative z-20 bg-[#121518] border-t border-white/10 p-3.5 sm:p-4"
        >
          <RouterLink
            :to="{ name: 'division-detalle', params: { id: division.id } }"
            class="w-full py-2.5 px-4 rounded-xl border border-white/20 bg-[#181c21] hover:bg-[#3ca374] hover:border-[#3ca374] hover:text-black text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300"
          >
            <span>{{ division.textoBoton }}</span>
            <i class="ri-arrow-right-up-line text-sm" aria-hidden="true"></i>
          </RouterLink>
        </div>

        <!-- Botón "+" abajo a la izquierda en >= 770px -->
        <div class="hidden min-[770px]:flex items-center group absolute bottom-5 left-4 z-40">
          <button
            type="button"
            :aria-label="division.textoBoton"
            class="boton-sidebar-desktop w-10 h-10 shrink-0 rounded-full border border-white/30 bg-[#121518]/85 group-hover:bg-[#3ca374] group-hover:border-[#3ca374] group-hover:text-black text-white flex items-center justify-center text-xl shadow-xl cursor-pointer"
          >
            <i class="ri-add-line" aria-hidden="true"></i>
          </button>

          <RouterLink
            :to="{ name: 'division-detalle', params: { id: division.id } }"
            class="pointer-events-none opacity-0 -translate-x-3 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-x-0 ml-2.5 px-4 py-2 rounded-full border border-white/25 bg-[#121518]/95 hover:bg-[#1d2227] text-white text-xs font-semibold whitespace-nowrap inline-flex items-center gap-2 shadow-xl transition-all duration-300"
          >
            <span>{{ division.textoBoton }}</span>
            <i class="ri-arrow-right-up-line text-sm" aria-hidden="true"></i>
          </RouterLink>
        </div>
      </section>
    </div>
  </article>
</template>
