<script setup lang="ts">
import Flex from './Flex.vue';
import Box from './Box.vue';

const props = defineProps<{
  data: WatchHistory;
}>();

const timeProcess = computed(() => props.data.timeProcess);
const watchPercent = computed(() => calculateWatchedPercentage(timeProcess.value))
const router = useRouter();
const movieStore = useMovieStore();
const goToDetail = () => {
  movieStore.setMovieId(props.data.movie.id);
  router.push({ 
    path: `/xem-phim/${props.data.movie.slug}`, 
    query: { server: 'vietsub', ep: props.data.episode } 
  });
};
const lastWatchedAt = computed(() => {
    return formatDate(new Date(props.data.lastWatchedAt), "DD-MM-YYYY HH:mm:ss");
});

</script>

<template>
  <Flex 
    :direction="'column'"
    @click="goToDetail"
    :style="{ cursor: 'pointer' }"
  >
    <NuxtImg 
      :src="data?.movie.poster" 
      :alt="data?.movie.poster" 
      :style="{
        width: '290px',
        height: '170px',
        borderRadius: '8px',
        objectFit: 'cover'
      }"
    />
    <h4 
      :style="{ 
        fontSize: '14px',
      }"
    >
      {{ data.movie.title }}
    </h4>
    <p :style="{ fontSize: '12px', color: '#888', marginTop: '4px' }">
      Lần xem cuối: {{ lastWatchedAt }}
    </p>
    <Box class="progress-container">
      <ProgressBar class="progress-bar" :style="{ width: '440px' }" :value="watchPercent" ></ProgressBar>
      <div class="progress-icon" :style="{ left: (watchPercent - 3) + '%' }"></div>
    </Box>
  </Flex>
</template>

<style scoped>
.progress-container {
    position: relative;
    width: 100%;
    height: 24px;
    max-height: 24px;
    overflow: visible;
}
.progress-icon {
    position: absolute;
    top: -8px;
    height: 30px;
    width: 30px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%230044cc' stroke='%23ffffff' stroke-width='5'/%3E%3Ccircle cx='30' cy='30' r='5' fill='%23ffffff'/%3E%3Ccircle cx='70' cy='30' r='5' fill='%23ffffff'/%3E%3Ccircle cx='30' cy='70' r='5' fill='%23ffffff'/%3E%3Ccircle cx='70' cy='70' r='5' fill='%23ffffff'/%3E%3Ccircle cx='50' cy='50' r='10' fill='%23ffffff'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 50%;
    animation: spinReel 2.5s infinite linear;
    z-index: 10;
    transform: translateX(-50%);
    transition: left 0.5s ease-in-out;
}

@keyframes spinReel {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
