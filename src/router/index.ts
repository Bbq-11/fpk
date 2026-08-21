import { createRouter, createWebHistory } from 'vue-router'
import TrainCatalogPage from '@/pages/TrainCatalogPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'catalog',
      component: TrainCatalogPage,
      meta: {
        title: 'Туристические поезда',
      },
    },
    {
      path: '/trains/:id',
      name: 'train-details',
      component: () => import('@/pages/TrainDetailsPage.vue'),
      props: true,
      meta: {
        title: 'Описание поезда',
      },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.path === from.path) return false

    return { top: 0 }
  },
})

export default router
