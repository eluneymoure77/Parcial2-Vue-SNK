import { ref, onMounted, onUnmounted, watch } from 'vue'

const abierto = ref(false)
const mensajePendiente = ref('')
const mostrarAvisoMobile = ref(false)

export function useInstructor() {
  let intervaloAviso = null
  let timeoutOcultar = null
  let timeoutInicio = null

  function abrirChat(promptInicial = '') {
    abierto.value = true
    if (promptInicial.trim()) {
      mensajePendiente.value = promptInicial.trim()
    }
  }

  function consumirMensajePendiente() {
    const texto = mensajePendiente.value
    mensajePendiente.value = ''
    return texto
  }

  function consultarDivisionInicial() {
    abrirChat(
      "I'm a recruit looking to give my best! I want to know which division I could belong to."
    )
  }

  function recomendarSiguienteSeccion() {
    abrirChat(
      "I just finished reviewing the story timeline. What section or archive on this page should I check out next?"
    )
  }

  function limpiarTimersAviso() {
    clearInterval(intervaloAviso)
    clearTimeout(timeoutOcultar)
    clearTimeout(timeoutInicio)
  }

  function dispararAvisoMobile() {
    if (abierto.value || window.innerWidth >= 768) return
    mostrarAvisoMobile.value = true
    clearTimeout(timeoutOcultar)
    timeoutOcultar = setTimeout(() => {
      mostrarAvisoMobile.value = false
    }, 2600)
  }

  onMounted(() => {
    timeoutInicio = setTimeout(dispararAvisoMobile, 1200)
    intervaloAviso = setInterval(dispararAvisoMobile, 9000)
  })

  watch(abierto, (estaAbierto) => {
    if (estaAbierto) {
      mostrarAvisoMobile.value = false
      clearTimeout(timeoutOcultar)
    }
  })

  onUnmounted(limpiarTimersAviso)

  return {
    abierto,
    mensajePendiente,
    mostrarAvisoMobile,
    abrirChat,
    consumirMensajePendiente,
    consultarDivisionInicial,
    recomendarSiguienteSeccion,
  }
}