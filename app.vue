<script setup lang="ts">
import Loading from '@/components/global/loading/index.vue';
import SplashScreen from './components/molecules/SplashScreen.vue';
import { useHead, useRoute, watchEffect } from '#imports'
import { routes } from './app/routes';

const route = useRoute()

// Hàm lấy tiêu đề từ routes
const pageTitle = computed(() => {
  if (route.name === 'movies-detail' && route.params.title) {
    return `${route.params.title}`
  }

  const matchedRoute = Object.values(routes).find((r) => r.path === route.path)
  return matchedRoute ? matchedRoute.title : 'Trang mặc định'
})

useHead(() => ({
  title: pageTitle.value
}))
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <SplashScreen />
    <NuxtLayout>
      <Loading/>
      <NuxtPage></NuxtPage>
    </NuxtLayout>
  </div>
</template>