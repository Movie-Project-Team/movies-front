<script setup lang="ts">
import { useLoadingStore } from '~/stores/loading';

const loadingStore = useLoadingStore();
</script>

<template>
  <div v-if="loadingStore.isLoading" class="box">
    <div class="loader"></div>
  </div>
</template>

<style scoped>
.box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
}

.loader {
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 8px solid transparent;
  border-right-color: hsl(204, 98%, 47%);
  position: relative;
  animation: l24 1s infinite linear;
}

.loader:before,
.loader:after {
  content: "";
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: inherit;
  animation: inherit;
  animation-duration: 2s;
}
.loader:after {
  animation-duration: 4s;
}

@keyframes l24 {
  100% {transform: rotate(1turn)}
}
</style>
