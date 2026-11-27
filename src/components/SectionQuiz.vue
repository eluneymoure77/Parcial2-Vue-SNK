<script setup>
import { ref, computed } from 'vue'
import { PREGUNTAS_QUIZ, RESULTADOS_DIVISION } from '@/data/quiz.js'

// 'bienvenida' | 'preguntas' | 'resultado'
const vista = ref('bienvenida')
const indicePregunta = ref(0)
const respuestas = ref([])

const preguntaActual = computed(() => PREGUNTAS_QUIZ[indicePregunta.value])
const opcionSeleccionada = computed(() => respuestas.value[indicePregunta.value] || null)
const progresoPorcentaje = computed(() => {
  return ((indicePregunta.value + 1) / PREGUNTAS_QUIZ.length) * 100
})
const esUltimaPregunta = computed(() => indicePregunta.value === PREGUNTAS_QUIZ.length - 1)

const divisionGanadoraKey = computed(() => {
  const conteo = { legion: 0, guarnicion: 0, policia: 0 }
  for (const resp of respuestas.value) {
    if (resp?.division in conteo) conteo[resp.division]++
  }
  return Object.entries(conteo).reduce((mejor, actual) =>
    actual[1] > mejor[1] ? actual : mejor
  )[0]
})

const resultadoActual = computed(() => {
  return RESULTADOS_DIVISION[divisionGanadoraKey.value] || RESULTADOS_DIVISION.legion
})

function iniciarQuiz() {
  indicePregunta.value = 0
  respuestas.value = []
  vista.value = 'preguntas'
}

function seleccionarOpcion(opcion) {
  respuestas.value[indicePregunta.value] = opcion
}

function preguntaAnterior() {
  if (indicePregunta.value > 0) {
    indicePregunta.value--
  } else {
    vista.value = 'bienvenida'
  }
}

function siguientePregunta() {
  if (!opcionSeleccionada.value) return

  if (!esUltimaPregunta.value) {
    indicePregunta.value++
  } else {
    vista.value = 'resultado'
  }
}
</script>

<template>
  <section
    v-if="vista !== 'resultado'"
    id="section-quiz"
    aria-labelledby="quiz-titulo-principal"
    class="quiz-section-bg py-10 sm:py-14 px-4 sm:px-8 lg:px-12"
  >
    <!-- Vista 1 -->
    <div v-if="vista === 'bienvenida'" class="mx-auto flex max-w-6xl flex-col gap-8 sm:gap-10">
      <header class="flex flex-wrap items-center justify-between gap-2 border-b border-tinta/15 pb-3 font-rubik text-[11px] font-semibold tracking-[0.12em] uppercase text-muted">
        <span>S / K — MILITARY ARCHIVE</span>
        <span>TRAINING CORPS / 104TH</span>
      </header>

      <div class="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
        <div class="order-2 lg:order-1 lg:col-span-5">
          <div class="quiz-card-shadis">
            <span class="relative z-20 self-start font-rubik text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase text-bosque-oscuro/80">
              YOUR STORY STARTS HERE
            </span>

            <span aria-hidden="true" class="quiz-numero-marca">104</span>

            <img
              src="../assets/img/shadis-bienvenida.png"
              alt="Instructor Keith Shadis"
              class="quiz-shadis-img"
            />

            <div class="quiz-tag-instructor">
              <span aria-hidden="true" class="text-sm leading-none">🎖️</span>
              <div class="leading-tight">
                <span class="block font-rubik text-[9px] tracking-[0.14em] uppercase text-pergamino/65">
                  YOUR INSTRUCTOR
                </span>
                <strong class="font-rubik text-xs sm:text-sm tracking-wider uppercase">
                  KEITH SHADIS
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div class="order-1 lg:order-2 space-y-5 lg:col-span-7">
          <span class="quiz-badge-orden">RECRUITMENT ORDER</span>

          <h2 id="quiz-titulo-principal" class="quiz-titulo-principal">
            Recruitment <br />
            <span class="italic font-bold">Trial</span>
          </h2>

          <div aria-hidden="true" class="h-[2px] w-12 bg-rojo-ladrillo"></div>

          <p class="max-w-xl font-sans text-base sm:text-lg leading-relaxed text-muted">
            Five questions and Instructor Shadis assigns you a division. Answer honestly:
            in this war there are no right answers, only recruits with convictions.
          </p>

          <div class="quiz-cta-box max-w-xl">
            <p class="font-rubik text-[11px] font-bold tracking-[0.12em] uppercase text-muted">
              5 QUESTIONS • ONE DIVISION
            </p>

            <button type="button" @click="iniciarQuiz" class="quiz-btn-descubrir">
              <span>DISCOVER MY DIVISION</span>
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </div>

      <footer class="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 pt-2">
        <div class="border-t-2 border-bosque-oscuro pt-3 font-rubik text-[11px] font-bold tracking-[0.1em] uppercase text-bosque-oscuro">
          01 ANSWER HONESTLY
        </div>
        <div class="border-t border-tinta/20 pt-3 font-rubik text-[11px] font-bold tracking-[0.1em] uppercase text-muted/75">
          02 PROVE YOUR CONVICTIONS
        </div>
        <div class="border-t border-tinta/20 pt-3 font-rubik text-[11px] font-bold tracking-[0.1em] uppercase text-muted/75">
          03 DISCOVER YOUR DIVISION
        </div>
      </footer>
    </div>

    <!-- VISTA 2 -->
    <div v-else class="mx-auto flex max-w-6xl flex-col gap-6 sm:gap-8">
      <header class="flex flex-wrap items-center justify-between gap-2 border-b border-tinta/15 pb-3 font-rubik text-[11px] font-semibold tracking-[0.12em] uppercase text-muted">
        <span>S / K — MILITARY ARCHIVE</span>
        <span>TRAINING CORPS / 104TH</span>
      </header>

      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="quiz-titulo-principal" class="font-fell text-3xl sm:text-4xl text-bosque-oscuro">
          Recruitment Trial
        </h2>
        <span class="font-rubik text-[11px] font-bold tracking-[0.12em] uppercase text-muted">
          02 / EVALUATION
        </span>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
        <aside aria-label="Instructor evaluation panel" class="quiz-panel-shadis lg:col-span-4">
          <div>
            <div class="quiz-panel-shadis-header">
              {{ preguntaActual.mision }}
            </div>

            <div class="p-5 sm:p-6 space-y-3">
              <h3 class="font-fell text-2xl sm:text-[1.7rem] leading-snug text-hueso">
                Are you ready to find out which division you will join?
              </h3>
              <p class="font-sans text-xs sm:text-sm leading-relaxed text-pergamino/75">
                Five questions and Instructor Shadis assigns you a division. Answer honestly:
                in this war there are no right answers, only recruits with convictions.
              </p>
            </div>
          </div>

          <div class="flex flex-1 items-end justify-center overflow-hidden pt-2">
            <img
              src="../assets/img/shadis-evaluando.png"
              alt="Instructor Shadis evaluating"
              class="quiz-shadis-evaluando-img"
            />
          </div>

          <div class="quiz-panel-shadis-footer">
            <span>SHADIS IS EVALUATING</span>
            <span class="quiz-punto-evaluando" aria-hidden="true"></span>
          </div>
        </aside>

        <section aria-label="Current trial question" class="quiz-card-pregunta lg:col-span-8">
          <div class="space-y-5">
            <div class="flex flex-wrap items-center justify-between gap-2 font-rubik text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase">
              <span class="text-verde-card">DECISION 0{{ indicePregunta + 1 }}</span>
              <span class="text-muted">CHOOSE ONE ANSWER</span>
            </div>

            <div class="space-y-2">
              <div class="font-rubik text-[11px] font-bold tracking-[0.12em] uppercase text-muted">
                0{{ indicePregunta + 1 }} OF 0{{ PREGUNTAS_QUIZ.length }}
              </div>
              <div
                role="progressbar"
                :aria-valuenow="indicePregunta + 1"
                :aria-valuemin="1"
                :aria-valuemax="PREGUNTAS_QUIZ.length"
                class="h-1.5 w-full overflow-hidden rounded-full bg-tinta/10"
              >
                <div
                  class="h-full rounded-full bg-verde-card transition-all duration-300"
                  :style="{ width: `${progresoPorcentaje}%` }"
                ></div>
              </div>
            </div>

            <h3 class="font-rubik text-xl sm:text-2xl font-bold leading-snug text-tinta">
              {{ preguntaActual.pregunta }}
            </h3>

            <div role="radiogroup" :aria-label="preguntaActual.pregunta" class="space-y-3 pt-1">
              <button
                v-for="opcion in preguntaActual.opciones"
                :key="opcion.letra"
                type="button"
                role="radio"
                :aria-checked="opcionSeleccionada?.letra === opcion.letra"
                @click="seleccionarOpcion(opcion)"
                class="quiz-opcion-btn"
                :class="{ 'quiz-opcion-activa': opcionSeleccionada?.letra === opcion.letra }"
              >
                <div class="flex items-center gap-3.5">
                  <span
                    class="quiz-letra-opcion"
                    :class="{ 'quiz-letra-activa': opcionSeleccionada?.letra === opcion.letra }"
                  >
                    {{ opcion.letra }}
                  </span>
                  <span class="font-sans text-sm sm:text-base font-medium">
                    {{ opcion.texto }}
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
                  :class="opcionSeleccionada?.letra === opcion.letra
                    ? 'border-hueso'
                    : 'border-tinta/35'"
                >
                  <span
                    v-if="opcionSeleccionada?.letra === opcion.letra"
                    class="h-2.5 w-2.5 rounded-full bg-hueso"
                  ></span>
                </span>
              </button>
            </div>
          </div>

          <div class="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-tinta/10 pt-5">
            <button
              type="button"
              @click="preguntaAnterior"
              class="font-rubik text-xs font-bold tracking-wider uppercase text-muted hover:text-tinta cursor-pointer"
            >
              <span aria-hidden="true">←</span> Previous question
            </button>

            <button
              type="button"
              @click="siguientePregunta"
              :disabled="!opcionSeleccionada"
              class="quiz-btn-siguiente"
            >
              <span>{{ esUltimaPregunta ? 'See result' : 'Next' }}</span>
              <span aria-hidden="true">&gt;</span>
            </button>
          </div>
        </section>
      </div>

      <footer class="flex flex-wrap items-center justify-between gap-2 border-t border-tinta/15 pt-4 font-rubik text-[10px] sm:text-[11px] font-semibold tracking-[0.12em] uppercase text-muted/80">
        <span>NO RIGHT ANSWERS. ONLY CONVICTIONS.</span>
        <span>RECRUITMENT IN PROGRESS / 01–05</span>
      </footer>
    </div>
  </section>

  <!-- VISTA 3 -->
  <!-- VISTA 3 -->
  <section
    v-else
    id="section-quiz"
    aria-labelledby="quiz-resultado-titulo"
    :class="['quiz-resultado-bg', `quiz-resultado--${resultadoActual.id}`]"
    :style="{ '--quiz-bg-img': `url('${resultadoActual.imagenFondo}')` }"
    class="relative pt-6 sm:pt-8 pb-0 px-4 sm:px-8 lg:px-12 overflow-hidden"
  >
    <div class="relative z-10 mx-auto flex max-w-6xl flex-col justify-between gap-0">
      <div class="flex flex-col gap-4 sm:gap-5">
        <header class="flex flex-wrap items-center justify-between gap-3 border-b border-hueso/15 pb-3">
          <div class="border-l-2 border-hueso/75 pl-3 leading-tight">
            <span class="block font-rubik text-[10px] font-bold tracking-[0.14em] uppercase text-hueso/80">
              SHINGEKI NO KYOJIN
            </span>
            <span class="font-fell text-sm sm:text-base text-hueso">
              Recruitment Trial
            </span>
          </div>

          <div class="quiz-resultado-pill">
            <span>05 / 05</span>
            <span aria-hidden="true">•</span>
            <span>EVALUATION COMPLETED</span>
          </div>
        </header>

        <div class="grid grid-cols-1 items-end gap-6 lg:grid-cols-12 lg:gap-10">
          <div class="order-2 lg:order-1 space-y-4 lg:col-span-7 pb-8 lg:pb-12">
            <p class="font-rubik text-[11px] font-bold tracking-[0.16em] uppercase text-hueso/80">
              — YOUR DIVISION IS DECIDED
            </p>

            <h2 id="quiz-resultado-titulo" class="quiz-resultado-titulo">
              {{ resultadoActual.titulo }}
            </h2>

            <p class="font-rubik text-xs sm:text-sm font-bold tracking-[0.16em] uppercase text-hueso/85">
              {{ resultadoActual.subtitulo }}
            </p>

            <p class="max-w-xl font-sans text-base sm:text-lg leading-relaxed text-hueso/90">
              {{ resultadoActual.descripcion }}
            </p>

            <div class="flex flex-wrap items-center gap-3 pt-2">
              <router-link
                :to="{
                  name: 'division-detalle',
                  params: {
                    id:
                      resultadoActual.id === 'legion'
                        ? 'survey-corps'
                        : resultadoActual.id === 'guarnicion'
                          ? 'garrison'
                          : 'military-police',
                  },
                }"
                class="quiz-resultado-cta-principal"
                :class="resultadoActual.btnClass"
              >
                <span>{{ resultadoActual.cta }}</span>
                <span aria-hidden="true">↗</span>
              </router-link>

              <button
                type="button"
                @click="iniciarQuiz"
                class="quiz-resultado-cta-secundario"
              >
                <span>Retry trial</span>
              </button>
            </div>

            <p class="pt-1 font-rubik text-[11px] font-bold tracking-[0.14em] uppercase text-hueso/75">
              {{ resultadoActual.valores }}
            </p>
          </div>

          <!-- Imagen Shadis -->
          <div class="order-1 lg:order-2 relative z-20 flex flex-col items-center lg:col-span-5 lg:items-end self-end">
            <img
              src="../assets/img/shadis-resultado.png"
              alt="Instructor Keith Shadis"
              class="quiz-resultado-shadis-img"
            />

            <blockquote class="quiz-resultado-cita mb-3 lg:mb-0">
              <p class="font-fell italic text-base sm:text-lg lg:text-xl text-hueso">
                “Recruit, I already know where you will serve.”
              </p>
              <footer class="font-rubik text-[10px] font-bold tracking-[0.14em] uppercase text-hueso/75">
                KEITH SHADIS • INSTRUCTOR
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      <!-- Linea y texto de abajo -->
      <footer class="relative z-30 flex flex-wrap items-center justify-between gap-2 border-t border-hueso/15 py-4 font-rubik text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase text-hueso/75">
        <span>IN SERVICE OF HUMANITY</span>
        <span>YOUR NEXT MISSION STARTS NOW</span>
      </footer>
    </div>
  </section>
</template>