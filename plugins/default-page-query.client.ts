import { routes } from "~/app/routes";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:finish', () => {
    const route = useRoute();
    const router = useRouter();

    // Kiểm tra route hiện tại có requiresDefaultPageQuery là true không
    const needsPageQuery = Object.values(routes).find(
      (r) => r.path === route.path && r.requiresDefaultPageQuery
    );

    // Nếu route yêu cầu page=1 và chưa có page trong query
    if (needsPageQuery && !route.query.page) {
      router.replace({
        path: route.path,
        query: { ...route.query, page: '1' },
      });
    }
  });
});
