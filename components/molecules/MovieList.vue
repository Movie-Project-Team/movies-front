<script setup lang="ts">
import MovieCard from '../atoms/MovieCard.vue';
import { useSwiper } from '#imports'
import { ref } from 'vue'
import SkeletonContainer from '@/components/molecules/SkeletonContainer.vue';

const props = defineProps<{
  data: Movie[];
  isLoading?: boolean
}>();

const loadingState = ref(props.isLoading);
watch(() => props.isLoading, (newValue) => {
  loadingState.value = newValue;
});

const swiperCreativeRef = ref(null)
useSwiper(swiperCreativeRef, {
  modules: [], 
  slidesPerView: 8,
  spaceBetween: '20',
  breakpoints: {
    '500': {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    '768': {
      slidesPerView: 3,
    },
    '1200': {
      slidesPerView: 5,
      spaceBetween: 20,
    },
    '1540': {
      slidesPerView: 8,
      spaceBetween: 20,
    },
  },
  creativeEffect: {
    prev: {
      translate: ['-125%', 0, -800],
      rotate: [0, 0, -90],
    },
    next: {
      translate: ['125%', 0, -800],
      rotate: [0, 0, 90],
    },
  },
})
</script>

<template>
  <ClientOnly>
    <SkeletonContainer v-show="loadingState" type="list" :number-data="8"/>
    <swiper-container
      ref="swiperCreativeRef"
      :style="{ width: '100%' }"
      class="swiper-creative"
      :loop="true"
      :init="false"
      v-show="!loadingState"
    >
      <swiper-slide
        v-for="movie in data"
        :key="`slide-creative-${movie.id}`"
        class="swiper-slide"
        :style="{ width: '221px!important' }"
      >
        <MovieCard :data="movie" />
      </swiper-slide>
    </swiper-container>
  </ClientOnly>
</template>


<style scoped></style>
