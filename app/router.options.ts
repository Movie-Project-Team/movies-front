// router.options.js
import type { RouterConfig } from "nuxt/schema";
import { getCookie } from "~/utils/cookie";

export default <RouterConfig>{
  routes: (_routes) => [
    {
      name: 'root',
      path: '/',
      children: [
        {
          name: 'home',
          path: '',
          component: () => import('~/pages/index.vue'),
        },
        {
          name: 'phim',
          path: 'phim',
          children: [
            {
              name: 'movies-detail',
              path: ':title',
              component: () => import('@/pages/movies/detail.vue'),
            }
          ]
        },
        {
          name: 'xem-phim',
          path: 'xem-phim/:title',
          component: () => import('~/pages/movies/watch.vue'),
        },
        {
          name: 'tim-kiem',
          path: 'tim-kiem',
          component: () => import('@/pages/movies/search.vue'),
        },
        {
          name: 'sap-chieu',
          path: 'sap-chieu',
          component: () => import('~/pages/movies/upcoming.vue'),
        },
        {
          name: 'xem-chung',
          path: 'xem-chung',
          component: () => import('@/pages/movies/watch-together.vue'),
          meta: { requiresAuth: true }
        },
        {
          name: 'profile',
          path: 'profile',
          children: [
            {
              name: 'profile-information',
              path: '',
              component: () => import('@/pages/profiles/infomation.vue'),
            }
          ]
        },
      ]
    },
  ],
}