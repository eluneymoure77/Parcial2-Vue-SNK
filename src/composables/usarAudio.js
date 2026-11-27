import { ref } from 'vue'

const audio = new Audio()
const estaSonando = ref(false)
const cancionActiva = ref('')
const archivoActual = ref('')

audio.addEventListener('ended', () => {
  estaSonando.value = false
})

audio.addEventListener('error', (err) => {
  console.error('Error al cargar o reproducir el audio:', audio.src, err)
  estaSonando.value = false
})

export function usarAudio() {
  async function cambiarMusica(archivo, titulo) {
    if (!archivo) {
      console.warn('No se recibió ruta de archivo de audio para:', titulo)
      return
    }

    try {
      if (archivoActual.value === archivo && estaSonando.value) {
        audio.pause()
        estaSonando.value = false
        return
      }

      if (archivoActual.value !== archivo) {
        audio.pause()
        audio.src = archivo
        audio.currentTime = 0
        archivoActual.value = archivo
        cancionActiva.value = titulo
      }

      await audio.play()
      estaSonando.value = true
    } catch (error) {
      console.error('No se pudo reproducir el audio:', error)
      estaSonando.value = false
    }
  }

  function detenerMusica() {
    audio.pause()
    audio.currentTime = 0
    estaSonando.value = false
    cancionActiva.value = ''
    archivoActual.value = ''
  }

  return {
    estaSonando,
    cancionActiva,
    cambiarMusica,
    detenerMusica,
  }
}
