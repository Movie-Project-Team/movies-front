<script setup>
import { ref, onMounted } from "vue";
import Flex from "../atoms/Flex.vue";
import Box from "../atoms/Box.vue";

const showSplash = ref(false);
const progress = ref(0);
const interval = ref();
const startProgress = () => {
    interval.value = setInterval(() => {
      let newValue = progress.value + Math.floor(Math.random() * 10) + 10;
      if (newValue >= 100) {
          newValue = 100;
          clearInterval(interval.value);
          localStorage.setItem("hasVisited", "true");
          setTimeout(() => {
            showSplash.value = false;
          }, 500);
      }
      progress.value = newValue;
    }, 700);
};
const endProgress = () => {
    clearInterval(interval.value);
    interval.value = null;
};

onMounted(() => {
  const hasVisited = localStorage.getItem("hasVisited");

  if (!hasVisited) {
    startProgress();
    showSplash.value = true;
  }
});

onBeforeUnmount(() => {
  endProgress();
});
</script>

<template>
  <Flex direction="column" gap="8px" v-if="showSplash" class="splash-screen">
    <img src="https://streamvid.jwsuperthemes.com/wp-content/uploads/2023/02/logo.svg" alt="Movie Logo" />
    <h1>Chào mừng tới wesbite xem phim của chúng tôi</h1>
    <Box class="progress-container">
      <ProgressBar class="progress-bar" :style="{ width: '440px' }" :value="progress" ></ProgressBar>
    </Box>
  </Flex>
</template>

<style scoped>
.splash-screen {
  position: fixed;
  width: 100%;
  height: 100vh;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 9999;
  transition: opacity 1s ease-out;
}
.splash-screen img {
  width: 200px;
  animation: fadeIn 2s ease-in-out;
}
.splash-screen h1 {
  margin-top: 10px;
  font-size: 24px;
  animation: fadeIn 3s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
