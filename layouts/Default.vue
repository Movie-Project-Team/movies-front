<script setup lang="ts">
import Header from '@/components/molecules/Header.vue';
import Footer from '@/components/molecules/Footer.vue';

import { onUnmounted } from "vue";
import { useIntersectionObserver } from '@vueuse/core';

const clearStorage = () => {
  localStorage.removeItem("hasVisited");
};

onUnmounted(() => {
  window.removeEventListener("beforeunload", clearStorage);
});

const isHeaderFixed = ref(false);
const sentinel = ref<HTMLElement | null>(null);

useIntersectionObserver(
  sentinel,
  ([{ isIntersecting }]) => {
    isHeaderFixed.value = !isIntersecting;
  },
  {
    threshold: 0,
  }
);
</script>

<template>
  <div>
    <div ref="sentinel" style="height: 1px;"></div>
    <ClientOnly>
      <Header 
        :class="[
          'header',
          isHeaderFixed ? 'header--fixed' : 'header--absolute'
        ]"
      />
        <slot />
      <Footer />
        <ScrollTop
          icon="pi pi-arrow-up" 
          :buttonProps="{ severity: 'contrast', raised: true, rounded: true }" 
        />
    </ClientOnly>
  </div>
</template>

<style scoped>
.header {
  width: 100%;
  top: 0;
  left: 0;
  z-index: 9998;
  transition: all 0.3s ease;
}

.header--fixed {
  position: fixed;
  transform: translateY(0)!important;
  border: 1px solid #272932!important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)!important;
  background: #00031c!important;
}

.header--absolute {
  position: absolute;
  transform: translateY(0)!important;
}
</style>
