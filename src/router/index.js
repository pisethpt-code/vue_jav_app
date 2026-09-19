import { createRouter, createWebHistory } from 'vue-router'
import Uploader from '@/views/Uploader.vue'
import List from '@/views/List.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'upload',
      component: Uploader,
    },
    {
      path: '/list',
      name: 'list',
      component: List,
    },
  ],
})

export default router
