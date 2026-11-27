import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/personajes',
    name: 'personajes',
    component: () => import('../views/PersonajesView.vue'),
  },
  {
    path: '/personajes/:id',
    name: 'personaje-detalle',
    component: () => import('../views/PersonajeDetalleView.vue'),
    props: true,
  },
  {
    path: '/manga',
    name: 'manga',
    component: () => import('../views/MangaView.vue'),
  },
  {
    path: '/divisiones',
    name: 'divisiones',
    component: () => import('../views/DivisionesView.vue'),
  },
  {
    path: '/divisiones/:id',
    name: 'division-detalle',
    component: () => import('../views/DivisionDetalleView.vue'),
  },
  {
    path: '/favoritos',
    name: 'favoritos',
    component: () => import('../views/FavoritosView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    if (to.hash) {
      return new Promise((resolve) => {
        let intentos = 0
        const maxIntentos = 20

        const intentar = () => {
          const el = document.querySelector(to.hash)
          if (el) {
            resolve({ el, behavior: 'smooth', top: 100 })
            return
          }
          if (intentos++ < maxIntentos) {
            setTimeout(intentar, 50)
          } else {
            resolve({ top: 0 })
          }
        }

        intentar()
      })
    }

    return { top: 0 }
  }
})

export default router
