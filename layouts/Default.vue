<script setup lang="ts">
import Header from '@/components/molecules/Header.vue';
import Footer from '@/components/molecules/Footer.vue';

import { onMounted, onUnmounted } from "vue";

const clearStorage = () => {
  localStorage.removeItem("hasVisited");
};

onUnmounted(() => {
  window.removeEventListener("beforeunload", clearStorage);
});
</script>

<template>
  <div>
  <ClientOnly>
    <Header 
      :style="{
        position: 'absolute',
        zIndex: '9998',
        top: '0',
        left: '0',
        marginLeft: 'auto',
        marginRight: 'auto',
      }"
    />
      <slot />
    <Footer />
  </ClientOnly>
  </div>
</template>

<style scoped></style>
