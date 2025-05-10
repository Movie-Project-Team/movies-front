<script setup lang="ts">
import { useSwiper } from '#imports'
import { ref } from 'vue'
import SkeletonContainer from './SkeletonContainer.vue';
import MovieCardV2 from '../atoms/MovieCardV2.vue';

const props = defineProps<{
  data: Movie[];
  isLoading?: boolean
}>();

watch(() => props.data, (newVal) => {
  console.log(props.data,newVal);
})
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
    '100': {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    '510': {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    '700': {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    '1540': {
      slidesPerView: 4,
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
        :key="`list-slide-creative-${movie.id}`"
        class="swiper-slide"
        :style="{ width: '221px!important' }"
      >
        <MovieCardV2 :data="movie"/>
      </swiper-slide>
    </swiper-container>
  </ClientOnly>
</template>


<style scoped></style>
