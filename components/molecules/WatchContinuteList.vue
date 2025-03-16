<script setup lang="ts">
import { useSwiper } from '#imports'
import { ref } from 'vue'
import MovieCardHorizon from '../atoms/MovieCardHorizon.vue';
import SkeletonContainer from '@/components/molecules/SkeletonContainer.vue';

const props = defineProps<{
  data: Movie[];
  isLoading?: boolean;
}>();

const loadingState = ref(props.isLoading);
watch(() => props.isLoading, (newValue) => {
  loadingState.value = newValue;
});

const swiperCreativeRef = ref(null)
useSwiper(swiperCreativeRef, {
  modules: [], 
  slidesPerView: 6,
  spaceBetween: '20',
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
    <SkeletonContainer v-show="loadingState" type="list" :is-image-list="true" :number-data="6"/>
    <swiper-container v-show="!loadingState" ref="swiperCreativeRef" :style="{ width: '100%' }" class="swiper-creative" :loop="true" :init="false">
      <swiper-slide
        v-for="movie in data"
        :key="`slide-creative-${movie.id}`"
        class="swiper-slide"
        :style="{ width: '221px!important' }"
      >
        <MovieCardHorizon :data="movie"/>
      </swiper-slide>
    </swiper-container>
  </ClientOnly>
</template>

<style scoped></style>
