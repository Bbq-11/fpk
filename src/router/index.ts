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
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})

export default router
