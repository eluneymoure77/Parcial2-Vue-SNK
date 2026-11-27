<script setup>
// Importaciones de Vue y estilos
import { ref, nextTick, computed, watch } from 'vue'
import { useInstructor } from '../composables/useInstructor.js'
import '../assets/style/instructor.css'

// Propiedades recibidas desde el componente padre (contexto de la IA)
const props = defineProps({ contexto: { type: String, default: '' } })
const { abierto, mensajePendiente, mostrarAvisoMobile, consumirMensajePendiente } = useInstructor()

// Configuración de la API de OpenRouter
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
const API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODELO = 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free'

// Estados principales de la interfaz del chat
const historial = ref([])
const mensaje = ref('')
const cargando = ref(false)
const error = ref('')
const caja = ref(null)

// Estados del test de reclutamiento
const testAbierto = ref(false)
const preguntaActual = ref(0)
const respuestas = ref([])
const errorTest = ref(false)
const resultadoFinal = ref(null)

// Preguntas del test de reclutamiento
const preguntas = [
  {
    p: "The alarm sounds and there is a threat outside the walls. What do you do?",
    o: [{ t: "I go out to face it.", d: "legion" }, { t: "I stay at my post and reinforce the defense.", d: "guarnicion" }, { t: "I secure the area and prevent panic.", d: "policia" }]
  },
  {
    p: "What do you value most?",
    o: [{ t: "Freedom.", d: "legion" }, { t: "The safety of my loved ones.", d: "guarnicion" }, { t: "Order and stability.", d: "policia" }]
  },
  {
    p: "What is your best quality?",
    o: [{ t: "Courage.", d: "legion" }, { t: "Perseverance.", d: "guarnicion" }, { t: "Discipline.", d: "policia" }]
  },
  {
    p: "What would your ideal day at the barracks be like?",
    o: [{ t: "An exploration mission.", d: "legion" }, { t: "A quiet guard duty alongside my comrades.", d: "guarnicion" }, { t: "An orderly patrol through the city.", d: "policia" }]
  },
  {
    p: "What scares you the most?",
    o: [{ t: "Living without knowing what's outside.", d: "legion" }, { t: "Something happening to the people I care about.", d: "guarnicion" }, { t: "Everything falling out of control.", d: "policia" }]
  }
]

// Preguntas sugeridas para el chat
const sugerencias = [
  "How do I handle a Titan attack?",
  "What division values freedom the most?",
  "I want to protect my comrades, where should I go?",
  "Can you test my worth as a soldier?"
]

// Propiedad computada para determinar el emblema, nombre y colores según la división resultante
const infoDivisionResultante = computed(() => {
  if (resultadoFinal.value === 'legion') {
    return {
      name: 'Survey Corps',
      emblem: '/img/escudos/legion.png',
      textColor: 'text-azul-acero',
      borderColor: 'border-azul-acero',
      bgColor: 'bg-azul-acero/10'
    }
  }
  if (resultadoFinal.value === 'guarnicion') {
    return {
      name: 'Garrison',
      emblem: '/img/escudos/guarnicion.png',
      textColor: 'text-rojo-coral',
      borderColor: 'border-rojo-coral',
      bgColor: 'bg-rojo-coral/10'
    }
  }
  return {
    name: 'Military Police',
    emblem: '/img/escudos/policia.png',
    textColor: 'text-verde-claro',
    borderColor: 'border-verde-claro',
    bgColor: 'bg-verde-claro/10'
  }
})

// Función para armar el prompt del sistema (personalidad de Shadis)
function armarPrompt() {
  return `You are Keith Shadis, the Instructor of the Cadet Corps in Attack on Titan.
Rules:
- Speak in English, firm and authoritative, but motivating.
- Respond in plain text, max 300 chars.
- Use ONLY the following record.
- If unsure which division to join, ask a short question or tell them to take the recruitment test.

RECORD:
${props.contexto}`
}

// Función principal para enviar un mensaje a la IA y recibir respuesta
async function preguntar(textoDirecto = null) {
  const texto = textoDirecto || mensaje.value.trim()
  if (!texto || cargando.value) return

  error.value = ''
  historial.value.push({ role: 'user', content: texto })
  mensaje.value = ''
  cargando.value = true

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODELO,
        messages: [{ role: 'system', content: armarPrompt() }, ...historial.value.slice(-10)],
        reasoning: { enabled: false },
      }),
    })

    if (!response.ok) throw new Error(`Service error: ${response.status}`)
    const result = await response.json()
    const respuesta = result?.choices?.[0]?.message?.content
    if (!respuesta) throw new Error('No response from Instructor.')

    historial.value.push({ role: 'assistant', content: respuesta })
  } catch (e) {
    error.value = e.message || 'Could not contact the Instructor.'
  } finally {
    cargando.value = false
    await nextTick()
    if (caja.value) {
      caja.value.scrollTo({ top: caja.value.scrollHeight, behavior: 'smooth' })
    }
  }
}

watch(
  [abierto, mensajePendiente],
  async ([estaAbierto, textoPendiente]) => {
    if (estaAbierto && textoPendiente && !cargando.value) {
      testAbierto.value = false
      const texto = consumirMensajePendiente()
      await nextTick()
      preguntar(texto)
    }
  },
  { immediate: true }
)

// Función para reiniciar el chat y el test (botón Reset)
function cambiarTema() {
  historial.value = []
  testAbierto.value = false
  resultadoFinal.value = null
  error.value = ''
  mensaje.value = ''
}

// Función para iniciar el test de reclutamiento
function iniciarTest() {
  testAbierto.value = true
  preguntaActual.value = 0
  respuestas.value = new Array(preguntas.length).fill(null)
  resultadoFinal.value = null
  errorTest.value = false
}

// Función para guardar la opción seleccionada en el test
function seleccionarOpcion(division) {
  respuestas.value[preguntaActual.value] = division
  errorTest.value = false
}

// Función para avanzar a la siguiente pregunta del test
function siguientePregunta() {
  if (!respuestas.value[preguntaActual.value]) {
    errorTest.value = true
    return
  }
  if (preguntaActual.value < preguntas.length - 1) {
    preguntaActual.value++
  }
}

// Función para volver a la pregunta anterior del test
function anteriorPregunta() {
  if (preguntaActual.value > 0) {
    preguntaActual.value--
    errorTest.value = false
  }
}

// Función para calcular el resultado final del test
function finalizarTest() {
  if (!respuestas.value[preguntaActual.value]) {
    errorTest.value = true
    return
  }

  const conteo = { legion: 0, guarnicion: 0, policia: 0 }
  respuestas.value.forEach(r => conteo[r]++)

  let ganador = 'legion'
  if (conteo.guarnicion > conteo.legion) ganador = 'guarnicion'
  if (conteo.policia > conteo.guarnicion && conteo.policia > conteo.legion) ganador = 'policia'

  resultadoFinal.value = ganador
}
</script>

<template>
  <!-- Botón flotante para abrir el chat -->
  <button
    v-if="!abierto"
    type="button"
    @click="abierto = true"
    aria-label="Open chat with Keith Shadis"
    class="group fixed right-4 bottom-4 z-50 flex cursor-pointer items-center gap-2.5 md:right-8 md:bottom-8"
  >
    <span
      :class="
        mostrarAvisoMobile
          ? 'translate-x-0 opacity-100'
          : 'translate-x-2 opacity-0'
      "
      class="pointer-events-none flex items-center gap-1.5 rounded-xl border border-verde-medio/40 bg-bosque-oscuro/95 px-3 py-1.5 font-rubik text-xs font-bold tracking-wide text-pergamino shadow-lg transition-all duration-300 md:translate-x-2 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:border-verde-claro md:group-hover:opacity-100"
    >
      <i class="ri-chat-3-line text-sm text-verde-medio" aria-hidden="true"></i>
      <span>Chat</span>
    </span>

    <!-- Avatar -->
    <div
      aria-hidden="true"
      class="shadis-float-bg relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full transition duration-200 group-hover:scale-105 md:h-24 md:w-24"
    >
      <img
        src="/img/ia/shadis-icon.png"
        alt=""
        class="h-full w-full rounded-full object-cover ring-1 ring-verde-medio ring-offset"
      />
    </div>
  </button>

  <!-- Ventana principal del chat -->
  <section
    v-else
    aria-labelledby="instructor-chat-title"
    class="chat-window-bg fixed inset-0 z-40 flex flex-col overflow-hidden backdrop-blur-xl md:inset-auto md:bottom-5 md:right-6 md:h-auto md:max-h-[min(540px,calc(100dvh-6.25rem))] md:w-[22.5rem] lg:w-[23.5rem] md:rounded-2xl md:border border-verde-pizarra shadow-2xl"
  >
    <!-- Cabecera del chat (Avatar, nombre y botones) -->
    <header class="chat-header-bg flex items-center justify-between p-4 shrink-0">
      <div class="flex items-center gap-3">
        <div class="relative">
          <img src="/img/ia/shadis-icon.png" alt="Keith Shadis" class="h-14 w-14 rounded-full object-cover" />
          <!-- Puntito verde de conexión -->
          <span
            aria-hidden="true"
            class="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-bosque-oscuro bg-green-500"
          ></span>
        </div>
        <div>
          <h2 id="instructor-chat-title" class="font-fell text-xl text-pergamino leading-none">Keith Shadis</h2>
          <p class="text-[10px] text-verde-medio uppercase tracking-widest mt-1 font-bold">Instructor</p>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <!-- Botón para reiniciar el chat -->
        <button
          type="button"
          @click="cambiarTema"
          title="Change Topic"
          aria-label="Reset chat and test"
          class="cursor-pointer rounded-md p-2 text-xs font-bold text-pergamino/60 transition hover:bg-verde-pizarra hover:text-pergamino flex items-center gap-1"
        >
          <i class="ri-refresh-line" aria-hidden="true"></i> Reset
        </button>
        <!-- Botón para cerrar el chat -->
        <button
          type="button"
          @click="abierto = false"
          aria-label="Close chat"
          class="cursor-pointer rounded-md p-2 text-2xl leading-none text-pergamino/60 transition hover:bg-verde-pizarra hover:text-pergamino"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </header>

    <!-- Área desplazable de contenido -->
    <div ref="caja" aria-live="polite" class="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth chat-scrollbar">

      <!-- Vista del test de reclutamiento -->
      <section v-if="testAbierto" aria-label="Recruitment test" class="test-animate flex flex-col h-full">
        <div v-if="!resultadoFinal">
          <!-- Texto introductorio del test -->
          <p class="text-xs text-verde-medio italic mb-4 text-center">
            Answer honestly: in this war there are no right answers, only recruits with convictions.
          </p>

          <!-- Indicador de progreso y pregunta actual -->
          <div class="flex justify-between items-center mb-4 border-b border-verde-pizarra pb-2">
            <span class="text-[10px] text-pergamino/50 uppercase tracking-widest">Progress</span>
            <span class="text-xs font-bold text-pergamino bg-verde-pizarra px-2 py-1 rounded">
              Question {{ preguntaActual + 1 }} of {{ preguntas.length }}
            </span>
          </div>

          <!-- Pregunta actual -->
          <h3 class="text-sm font-bold text-pergamino mb-3">{{ preguntas[preguntaActual].p }}</h3>

          <!-- Opciones de respuesta -->
          <div role="radiogroup" :aria-label="preguntas[preguntaActual].p" class="flex flex-col gap-2 mb-4">
            <button
              v-for="(opcion, i) in preguntas[preguntaActual].o"
              :key="i"
              type="button"
              role="radio"
              :aria-checked="respuestas[preguntaActual] === opcion.d"
              @click="seleccionarOpcion(opcion.d)"
              class="text-left text-xs p-3 rounded-lg border transition-all duration-200 cursor-pointer"
              :class="respuestas[preguntaActual] === opcion.d ? 'bg-verde-card border-verde-claro text-pergamino' : 'border-pergamino/20 text-pergamino/70 hover:bg-verde-pizarra/50'"
            >
              {{ opcion.t }}
            </button>
          </div>

          <!-- Mensaje de error si no se seleccionó una opción -->
          <p v-if="errorTest" role="alert" class="text-[10px] text-rojo-coral mb-3 font-bold">
            Choose an option to continue, recruit.
          </p>

          <!-- Botones de navegación del test -->
          <div class="flex justify-between gap-2 mt-auto pt-2 border-t border-verde-pizarra">
            <button
              type="button"
              @click="anteriorPregunta"
              :disabled="preguntaActual === 0"
              class="btn-chat-secondary px-3 py-1.5 text-xs font-bold rounded disabled:opacity-30 cursor-pointer"
            >
              Previous
            </button>
            <button
              v-if="preguntaActual < preguntas.length - 1"
              type="button"
              @click="siguientePregunta"
              class="btn-chat-primary px-3 py-1.5 text-xs font-bold rounded cursor-pointer"
            >
              Next
            </button>
            <button
              v-else
              type="button"
              @click="finalizarTest"
              class="btn-chat-primary px-3 py-1.5 text-xs font-bold rounded cursor-pointer"
            >
              See my division
            </button>
          </div>
        </div>

        <!-- Vista del resultado final del test -->
        <div v-else class="text-center py-6 flex flex-col items-center justify-center h-full">

          <!-- Escudo de la división asignada -->
          <img :src="infoDivisionResultante.emblem" :alt="infoDivisionResultante.name"
            class="h-36 w-36 object-contain mb-2 drop-shadow-lg" />

          <h3 class="text-lg font-fell text-pergamino mb-3">Your division is:</h3>

          <!-- Tarjeta con el color y nombre de la división -->
          <div class="w-full max-w-[85%] border py-3 px-4 rounded-xl mb-6 shadow-inner"
            :class="[infoDivisionResultante.borderColor, infoDivisionResultante.bgColor]">
            <p class="text-2xl font-bold uppercase tracking-widest" :class="infoDivisionResultante.textColor">
              {{ infoDivisionResultante.name }}
            </p>
          </div>

          <p class="text-xs text-pergamino/70 italic mb-6 px-4">
            The Instructor has evaluated your profile. Are you ready to join?
          </p>

          <!-- Botón para volver al chat normal -->
          <button
            type="button"
            @click="testAbierto = false"
            class="btn-chat-secondary px-6 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Return to chat
          </button>
        </div>
      </section>

      <!-- Vista principal del chat -->
      <template v-else>
        <!-- Mensaje de bienvenida del instructor -->
        <article v-if="historial.length === 0 && !cargando" aria-label="Instructor greeting" class="flex items-end gap-2">
          <img src="/img/ia/shadis-icon.png" alt="" aria-hidden="true" class="h-12 w-12 rounded-full object-cover mb-1 shrink-0" />
          <div
            class="chat-bubble-bot max-w-[85%] rounded-2xl rounded-bl-none p-3 text-sm leading-relaxed text-pergamino"
          >
            State your business, recruit. What do you want to know about the divisions?
          </div>
        </article>

        <!-- Historial de mensajes -->
        <article
          v-for="(m, i) in historial"
          :key="i"
          :aria-label="m.role === 'user' ? 'Your message' : 'Keith Shadis response'"
          class="flex items-end gap-2"
          :class="m.role === 'user' ? 'flex-row-reverse' : ''"
        >
          <img
            v-if="m.role === 'assistant'"
            src="/img/ia/shadis-icon.png"
            alt=""
            aria-hidden="true"
            class="h-12 w-12 rounded-full object-cover mb-1 shrink-0"
          />
          <div
            :class="m.role === 'user' ? 'chat-bubble-user text-pergamino ml-auto' : 'chat-bubble-bot text-pergamino mr-auto'"
            class="max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed"
          >
            {{ m.content }}
          </div>
        </article>

        <!-- Preguntas sugeridas y botón para iniciar el test -->
        <div v-if="historial.length === 0 && !cargando" class="mt-4">
          <p class="text-[10px] font-bold text-pergamino/50 uppercase tracking-wider mb-2 px-1">Suggested Questions</p>
          <div class="flex flex-col gap-2 mb-4">
            <button
              v-for="(sug, index) in sugerencias"
              :key="index"
              type="button"
              @click="preguntar(sug)"
              class="group flex items-center justify-between text-left text-xs text-pergamino/80 border border-verde-pizarra rounded-xl p-3 hover:bg-verde-card hover:text-pergamino transition-all duration-200 cursor-pointer"
            >
              <span>{{ sug }}</span>
              <i
                class="ri-arrow-right-line text-sm text-verde-medio opacity-0 group-hover:opacity-100 transition-opacity"
                aria-hidden="true"
              ></i>
            </button>
          </div>

          <!-- Botón para abrir el test -->
          <div class="border-t border-verde-pizarra pt-4">
            <p class="text-[10px] font-bold text-pergamino/50 uppercase tracking-wider mb-2 px-1">Recruitment Test</p>
            <button
              type="button"
              @click="iniciarTest"
              class="btn-chat-primary w-full flex items-center justify-center gap-2 text-xs font-bold rounded-xl px-5 py-2 cursor-pointer"
            >
              <i class="ri-quill-pen-line text-lg" aria-hidden="true"></i>
              <span>Start the test</span>
            </button>
          </div>
        </div>

        <!-- Indicador de carga mientras la IA responde -->
        <div v-if="cargando" class="flex items-end gap-2">
          <img src="/img/ia/shadis-icon.png" alt="" aria-hidden="true" class="h-12 w-12 rounded-full object-cover mb-1 shrink-0" />
          <div class="chat-bubble-bot rounded-2xl rounded-bl-none p-3 text-xs text-verde-medio">
            <span class="flex gap-1.5 items-center font-bold">
              Evaluating
              <span aria-hidden="true" class="animate-bounce inline-block h-1.5 w-1.5 bg-verde-medio rounded-full"></span>
              <span aria-hidden="true" class="animate-bounce inline-block h-1.5 w-1.5 bg-verde-medio rounded-full"
                style="animation-delay: 0.1s"></span>
              <span aria-hidden="true" class="animate-bounce inline-block h-1.5 w-1.5 bg-verde-medio rounded-full"
                style="animation-delay: 0.2s"></span>
            </span>
          </div>
        </div>
      </template>
    </div>

    <!-- Mensaje de error general -->
    <p
      v-if="error"
      role="alert"
      class="bg-rojo-coral/20 p-2 text-xs text-rojo-coral text-center shrink-0 border-t border-rojo-coral/30"
    >
      {{ error }}
    </p>

    <!-- Area para escribir -->
    <div v-if="!testAbierto" class="chat-input-area p-4 shrink-0">
      <form @submit.prevent="preguntar()" class="flex gap-2">
        <label for="instructor-chat-input" class="sr-only">Type your question</label>
        <input
          id="instructor-chat-input"
          v-model="mensaje"
          type="text"
          placeholder="Type your question..."
          class="min-w-0 flex-1 rounded-lg border border-verde-pizarra bg-bosque-oscuro px-4 py-2.5 text-sm text-pergamino placeholder-pergamino/40 focus:border-verde-medio focus:outline-none focus:ring-1 focus:ring-verde-medio transition-all"
        />
        <button
          type="submit"
          :disabled="cargando"
          aria-label="Send message"
          class="btn-chat-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-lg disabled:opacity-50 cursor-pointer"
        >
          <i class="ri-send-plane-fill text-lg" aria-hidden="true"></i>
        </button>
      </form>
    </div>
  </section>
</template>