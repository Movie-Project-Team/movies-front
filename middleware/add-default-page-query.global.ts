import { routes } from "~/app/routes";

export default defineNuxtRouteMiddleware((to) => {
  // Kiểm tra xem route có cần page=1 không (requiresDefaultPageQuery là true)
  const route = Object.values(routes).find(
    (route) => route.path === to.path && route.requiresDefaultPageQuery
  );

  // Nếu route yêu cầu page=1 và chưa có page trong query
  if (route && !to.query.page) {
    return navigateTo({
      path: to.path,
      query: {
        ...to.query,
        page: '1',  // Đặt page=1 nếu chưa có
      },
    });
  }
});
