// plugins/router.ts
import { defineNuxtPlugin } from '#app';
import { useLoadingStore } from '~/stores/loading';
import { useRouter } from '#imports';

export default defineNuxtPlugin(() => {
  const loadingStore = useLoadingStore();
  const router = useRouter();

  router.beforeEach(async (to, from, next) => {
    loadingStore.show(); 

    await new Promise((resolve) => setTimeout(resolve, 200));

    next();
  });

  router.afterEach(() => {
    setTimeout(() => {
      loadingStore.hide();
    }, 500);
  });
});
