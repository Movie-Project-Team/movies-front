// https://nuxt.com/docs/api/configuration/nuxt-config
import { Theme } from "./assets/css/theme";
import routerConfigs from "./app/router.options"

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  experimental: {
    renderJsonPayloads: false
  },
  devtools: { enabled: true },
  modules: [
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-swiper',
    '@nuxt/image',
  ],
  primevue: {
    autoImport: true,
    options: {
      ripple: true,
      inputVariant: 'filled',
      theme: {
          preset: Theme,
          options: {
              prefix: 'p',
              darkModeSelector: 'system',
              cssLayer: false
          }
      }
    }
  },
  css: [
    '@/assets/css/main.scss',
  ],
  router: {
    // @ts-ignore
    extendRoutes(routes, resolve) {
      const addRoutes = async () => {
        if (routerConfigs && routerConfigs.routes) {
          const additionalRoutes = await routerConfigs.routes([]);
          additionalRoutes.forEach(route => {
            routes.push({
              ...route,
              component: resolve(__dirname, route.component),
              meta: route.meta,
            });
          });
        }
      };
      
      addRoutes();
    },
    options: {
      scrollBehaviorType: 'smooth',
    }
  },
  buildModules: ['@nuxt/image'],
  plugins: [
    '@/plugins/vue-plyr.client',
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: {
        base: 'https://dummyjson.com',
        reBase: 'http://127.0.0.1:8000/api/v1/client',
        tmdb: 'https://api.themoviedb.org/3',
      },
      tmdbApiKey: process.env.TMDB_API_KEY,
      imageTmdbDomain: 'https://image.tmdb.org/t/p/original'
    }
  },
})