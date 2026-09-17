import { createRouter, createWebHistory } from 'vue-router'
import Uploader from '@/views/Uploader.vue'
import PlotList from '@/views/PlotList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'upload',
      component: Uploader,
    },
    {
      path: '/plotlist/:materialCode/:batchNumber',
      name: 'plot-list',
      component: PlotList,
    },
  ],
})

export default router
