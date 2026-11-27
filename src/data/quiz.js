import fondoLegionQuiz from '../assets/img/fondo-legion-quiz.png'
import fondoGuarnicionQuiz from '../assets/img/fondo-guarnicion-quiz.png'
import fondoPoliciaQuiz from '../assets/img/fondo-policia-quiz.png'

export const PREGUNTAS_QUIZ = [
  {
    id: 1,
    mision: 'MISSION 01 / UNDER THREAT',
    pregunta: 'The alarm sounds and there is a threat outside the walls. What do you do?',
    opciones: [
      { letra: 'A', texto: 'I go out to face it.', division: 'legion' },
      { letra: 'B', texto: 'I stay at my post and reinforce the defense.', division: 'guarnicion' },
      { letra: 'C', texto: 'I secure the area and prevent panic.', division: 'policia' }
    ]
  },
  {
    id: 2,
    mision: 'MISSION 02 / CONVICTIONS',
    pregunta: 'What do you value most?',
    opciones: [
      { letra: 'A', texto: 'Freedom.', division: 'legion' },
      { letra: 'B', texto: 'The safety of my loved ones.', division: 'guarnicion' },
      { letra: 'C', texto: 'Order and stability.', division: 'policia' }
    ]
  },
  {
    id: 3,
    mision: 'MISSION 03 / APTITUDE',
    pregunta: 'What is your greatest strength?',
    opciones: [
      { letra: 'A', texto: 'Courage.', division: 'legion' },
      { letra: 'B', texto: 'Perseverance.', division: 'guarnicion' },
      { letra: 'C', texto: 'Discipline.', division: 'policia' }
    ]
  },
  {
    id: 4,
    mision: 'MISSION 04 / MILITARY ROUTINE',
    pregunta: 'What would your ideal day at the barracks look like?',
    opciones: [
      { letra: 'A', texto: 'An expedition mission.', division: 'legion' },
      { letra: 'B', texto: 'A quiet watch alongside my comrades.', division: 'guarnicion' },
      { letra: 'C', texto: 'An orderly patrol through the city.', division: 'policia' }
    ]
  },
  {
    id: 5,
    mision: 'MISSION 05 / GREATEST FEAR',
    pregunta: 'What scares you the most?',
    opciones: [
      { letra: 'A', texto: 'Living without knowing what is out there.', division: 'legion' },
      { letra: 'B', texto: 'Something happening to those I care about.', division: 'guarnicion' },
      { letra: 'C', texto: 'Everything spinning out of control.', division: 'policia' }
    ]
  }
]

export const RESULTADOS_DIVISION = {
  legion: {
    id: 'legion',
    titulo: 'The Survey Corps',
    subtitulo: 'BEYOND THE WALLS',
    descripcion: 'You do not settle for living behind a wall. You prefer risk over doubt and freedom over comfort. Step out to explore: they are waiting for you.',
    cta: 'View Survey Corps characters',
    valores: 'BRAVERY / EXPLORATION / FREEDOM',
    btnClass: 'bg-gradient-to-r from-[#1b6ca8] to-[#3ba55d]',
    imagenFondo: fondoLegionQuiz
  },
  guarnicion: {
    id: 'guarnicion',
    titulo: 'Garrison Regiment',
    subtitulo: 'THE SAFETY OF THE WALLS',
    descripcion: 'You uphold what others take for granted. Your constancy protects your own when no one is watching. Without people like you, the walls cannot stand.',
    cta: 'View Garrison characters',
    valores: 'CONSTANCY / PROTECTION / LOYALTY',
    btnClass: 'bg-[#9c2b1b] hover:bg-[#7e2114]',
    imagenFondo: fondoGuarnicionQuiz
  },
  policia: {
    id: 'policia',
    titulo: 'Military Police Brigade',
    subtitulo: 'PROTECTORS OF SUPREME AUTHORITY',
    descripcion: 'You believe in order as the foundation of everything. Your calm and discipline keep people united when everything seems to fall apart.',
    cta: 'View Military Police characters',
    valores: 'ORDER / DISCIPLINE / STABILITY',
    btnClass: 'bg-[#2f6b47] hover:bg-[#245437]',
    imagenFondo: fondoPoliciaQuiz
  }
}