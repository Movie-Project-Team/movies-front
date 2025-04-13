export default defineNuxtRouteMiddleware((to) => {
    if (to.meta.requiresAuth) {
        const cookieAuth = getCookie("access_token");
  
      if (!cookieAuth) {
        return navigateTo({ path: '/', query: { openLoginModal: 'true' } });
      }
    }
});
  