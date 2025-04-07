<script lang="ts" setup>
import { ref, watch, onMounted, nextTick, computed } from 'vue';
import { Thumbs } from 'swiper/modules';
import Box from '../atoms/Box.vue';
import SlideItem from '../atoms/SlideItem.vue';

const props = defineProps<{
  data: Movie[];
}>();

// Sử dụng ref cho shuffledSlides để có thể cập nhật khi props.data thay đổi
const shuffledSlides = ref<Movie[]>([]);
const mainSwiper = ref<any>(null);
const thumbSwiper = ref<any>(null);

// Khi props.data thay đổi, xử lý dữ liệu và cập nhật shuffledSlides
watch(
  () => props.data,
  (newData) => {
    if (newData && newData.length > 0) {
      const movies = [...newData];
      for (let i = movies.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [movies[i], movies[j]] = [movies[j], movies[i]];
      }
      shuffledSlides.value = movies.slice(0, 10);
      nextTick(() => {
        updateSwipers();
      });
    }
  },
  { deep: true, immediate: true }
);

const swiperKey = computed(() => JSON.stringify(shuffledSlides.value.map((s) => s.id)));

function updateSwipers() {
  if (mainSwiper.value?.swiper && thumbSwiper.value?.swiper) {
    mainSwiper.value.swiper.params.thumbs.swiper = thumbSwiper.value.swiper;
    mainSwiper.value.swiper.thumbs.init();
    mainSwiper.value.swiper.thumbs.update();
  }
}

onMounted(() => {
  nextTick(() => {
    updateSwipers();
  });
});

// Khởi tạo Swiper cho main và thumb
useSwiper(mainSwiper, {
  modules: [Thumbs],
  thumbs: {
    swiper: null,
  },
});

useSwiper(thumbSwiper, {
  modules: [Thumbs],
  watchSlidesProgress: true,
  slidesPerView: 10,
});
</script>

<template>
  <Box :style="{ position: 'relative' }">
    <ClientOnly>
      <swiper-container
        ref="mainSwiper"
        class="swiper-creative-main"
        :key="swiperKey"
        :loop="true"
        v-show="shuffledSlides.length > 0"
      >
        <swiper-slide
          v-for="(slide, index) in shuffledSlides"
          :key="`slide-creative-${slide.id}-${index}`"
          class="swiper-slide"
        >
          <NuxtImg
            :src="slide.poster"
            :alt="slide.poster"
            style="width: 100%; height: calc(100% + 250px); object-fit: cover;"
            loading="lazy"
          />
          <SlideItem :data="slide" />
        </swiper-slide>
      </swiper-container>
      <swiper-container
        ref="thumbSwiper"
        class="swiper-creative-thumb"
        :key="swiperKey"
        :loop="true"
        v-show="shuffledSlides.length > 0"
      >
        <swiper-slide
          v-for="(slide, index) in shuffledSlides"
          :key="`slide-thumb-${slide.id}-${index}`"
          class="swiper-slide-thumb"
        >
          <NuxtImg
            :src="slide.thumbnail"
            :alt="slide.thumbnail"
            style="height: 120px; object-fit: cover;border-radius: 8px;"
            loading="lazy"
          />
        </swiper-slide>
      </swiper-container>
    </ClientOnly>
  </Box>
</template>

<style>
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

.swiper-creative-main {
  width: 100%;
  max-width: 1805px;
  height: 550px;
  border-radius: 32px;
  overflow: hidden;
}

.swiper-creative-thumb {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
}
.swiper-slide-thumb {
  width: 100px!important;
  height: 120px!important;
}
</style>
