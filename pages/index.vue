<script setup lang="ts">
import { useSwiper } from '#imports'
import { ref } from 'vue'
import { EffectFade } from 'swiper/modules';
import Box from '~/components/atoms/Box.vue';
import SectionContainer from '~/components/atoms/SectionContainer.vue';
import MovieList from '~/components/molecules/MovieList.vue';
import RankingContainer from '~/components/molecules/RankingContainer.vue';
import { useWindowWidth } from '@/composables/resize/windowWidth';
import WatchContinuteList from '~/components/molecules/WatchContinuteList.vue';
import { MovieService } from '~/services/DummnyDataMovie';
import SlideItem from '~/components/atoms/SlideItem.vue';
import { useGetListMovie } from '~/composables/api/movies/use-get-list-movie';

const slides = ref(MovieService.getMovieData());
const params = ref({
  "item": 10,
  "keyword": '',
});
const { data, isLoading: isLoadingMovie } = useGetListMovie(params);
const screenWidth = useWindowWidth();
const loading = useLoadingStore();
watchEffect(() => {
  if (isLoadingMovie.value) {
    loading.show();
  } else {
    loading.hide();
  }
});

const swiperCreativeRef = ref(null)
useSwiper(swiperCreativeRef, {
  modules: [EffectFade], 
  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },
  autoplay: {
    delay: 2000,
    disableOnInteraction: true,
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

provide('movies', data?.value?.data);
</script>

<template>
  <main>
    <div class="swiper-wrapper">
      <div class="swiper-wrapper__inner">
        <ClientOnly>
          <swiper-container ref="swiperCreativeRef" class="swiper-creative" :loop="true" :init="false">
            <swiper-slide
              v-for="slide in slides"
              :key="`slide-creative-${slide.id}`"
              class="swiper-slide"
            >
              <NuxtImg 
                :src="slide.src"
                :alt="slide.alt"
                style="width: 100%; height: calc(100vh - 40px); object-fit: cover;" 
                loading="lazy"
              />
              <SlideItem :data="slide" />
            </swiper-slide>
          </swiper-container>
        </ClientOnly>
      </div>
    </div>
    <Box :style="{ padding: '0px 50px', marginBottom: '60px' }">
      <SectionContainer :title="'Xem tiếp'">
        <WatchContinuteList :data="data?.data ?? []" :is-loading="isLoadingMovie"/>
      </SectionContainer>
      <SectionContainer :title="'Bảng xếp hạng'" :style="{display: screenWidth <= 900 ? 'none' : 'flex'}">
        <RankingContainer :data="data?.data ?? []" :is-loading="isLoadingMovie"/>
      </SectionContainer>
      <SectionContainer :title="'Phim mới'">
        <MovieList :data="data?.data ?? []" :is-loading="isLoadingMovie"/>
      </SectionContainer>
    </Box>
  </main>
</template>

<style lang="css">
html,
body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
}

#__nuxt {
  height: 100dvh;
  max-height: 100dvh;
  box-sizing: border-box;
}

main {
  display: flex;
  flex-direction: column;
}

swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 18px;
  font-size: 4rem;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
  height: 15vh;
}

.swiper-wrapper {
  display: flex;
  flex-direction: column;
}

.swiper-basic .swiper-wrapper {
  min-width: 100vh;
  width: 100vh;
}

.slide-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0px 70px!important;
  background: linear-gradient(to right,  rgba(34,31,31,1) 0%,rgba(34,31,31,0.4) 100%);
  color: #fff;
  padding: 1rem;
  z-index: 9999;
}

.slide-title {
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
  font-weight: bold;
}

.slide-description {
  font-size: 1rem;
  margin: 0;
}

.slide-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.slide-imdb,
.slide-release-year,
.slide-total-episodes,
.slide-genres,
.slide-description {
  font-size: 1rem;
  margin: 0.2rem 0;
}
</style>
