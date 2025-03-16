// types/router.d.ts
import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    layout?: string;
    requiresAuth?: boolean
  }
}
