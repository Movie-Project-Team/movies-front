<script setup lang="ts">
import { useSwiper } from '#imports'
import { ref, computed, reactive, watch, watchEffect, nextTick, onMounted } from 'vue'
import { EffectFade } from 'swiper/modules'
import Box from '~/components/atoms/Box.vue'
import SectionContainer from '~/components/atoms/SectionContainer.vue'
import WatchContinuteList from '~/components/molecules/WatchContinuteList.vue'
import SlideItem from '~/components/atoms/SlideItem.vue'
import { useGetListMovie } from '~/composables/api/movies/use-get-list-movie'
import { useGetListHistory } from '~/composables/api/movies/use-get-list-history'
import Flex from '~/components/atoms/Flex.vue'
import GokuLoading from '~/components/molecules/GokuLoading.vue'
import useResponsive from '~/composables/resize/use-responsive'
import { useIntersectionObserver } from '@vueuse/core'
import { useGetListMovieSections } from '../composables/api/movies/use-get-list-movie-sections'
import MovieCardV2 from '~/components/atoms/MovieCardV2.vue'
import RankingContainer from '~/components/molecules/RankingContainer.vue'

// Responsive
const { isDesktop, isMobile } = useResponsive()

// Fetch movie data
const params = ref({ item: 10, keyword: '', year: '2025' })
// const { data, isLoading: isLoadingMovie } = useGetListMovie(params)

// Swiper setup
const swiperCreativeRef = ref(null)
useSwiper(swiperCreativeRef, {
  modules: [EffectFade],
  effect: 'fade',
  fadeEffect: { crossFade: true },
  autoplay: { delay: 2000, disableOnInteraction: true },
  creativeEffect: {
    prev: { translate: ['-125%', 0, -800], rotate: [0, 0, -90] },
    next: { translate: ['125%', 0, -800], rotate: [0, 0, 90] },
  },
})

// Provide movies list
// provide('movies', data?.value?.data)

// Fetch history
const profileStore = useProfileStore()
const profileId = computed(() => profileStore.user?.id ?? 1)
const { data: historyList } = useGetListHistory(profileId)

// Intersection Observer Implementation
const visibleSections = reactive<Record<string, boolean>>({});
const sectionRefs = reactive<Record<string, HTMLElement | null>>({});
const { movieSections, results, isLoading: isLoadingMovie } = useGetListMovieSections();

// Global loading
const loading = useLoadingStore()
watchEffect(() => {
  isLoadingMovie.value ? loading.show() : loading.hide()
})

const visibleCount = ref(0);
const isSectionLoading = ref(false);
const loadedSections = reactive<Record<string, boolean>>({});

// Sửa lại hàm handleVisibleSection
const handleVisibleSection = (key: string) => {
  if (!loadedSections[key]) {
    // Kiểm tra nếu đã hiển thị đủ 3 section thì dừng
    if (visibleCount.value % 3 === 0 && visibleCount.value > 0) {
      isSectionLoading.value = true;
      
      // Delay 1 giây trước khi load tiếp
      setTimeout(() => {
        isSectionLoading.value = false;
        loadedSections[key] = true;
        visibleCount.value++;
      }, 3000);
    } else {
      loadedSections[key] = true;
      visibleCount.value++;
    }
  }
};

// Initialize sections and setup observers
const initializeSections = () => {
  movieSections.forEach((section: any) => {
    visibleSections[section.key] = false;
  });
};

const setupObservers = () => {
  movieSections.forEach((section: any, index: any) => {
    const element = sectionRefs[section.key];
    if (!element) return;

    useIntersectionObserver(
      element,
      ([{ isIntersecting }]) => {
        if (isIntersecting && !visibleSections[section.key] && !isSectionLoading.value) {
          visibleSections[section.key] = true;
          handleVisibleSection(section.key);
        }
      },
      { threshold: 0.1 }
    );
  });
};

onMounted(async () => {
  initializeSections();
  await nextTick();
  setupObservers();
});

watch(movieSections, async () => {
  initializeSections();
  await nextTick();
  setupObservers();
}, { immediate: true });
</script>

<template>
  <Box>
    <!-- Swiper Banner -->
    <div class="swiper-wrapper">
      <div class="swiper-wrapper__inner">
        <ClientOnly>
          <swiper-container
            ref="swiperCreativeRef"
            class="swiper-creative-slide"
            :style="{ height: isMobile ? '600px' : '820px', maxHeight: isMobile ? '600px' : '100vh' }"
            :loop="true"
            :init="false"
            v-show="(results['new']?.data?.value?.data ?? []).length > 0"
          >
            <swiper-slide
              v-for="slide in results['new']?.data?.value?.data ?? []"
              :key="`main-slide-${slide.id}`"
              class="swiper-slide"
            >
              <NuxtImg
                :src="slide.poster"
                :alt="slide.title"
                :style="{ width: '100%', height: isMobile ? '100%' : 'calc(100vh - 40px)', objectFit: 'cover' }"
                loading="lazy"
                class="img-slide"
              />
              <SlideItem :data="slide" />
            </swiper-slide>
          </swiper-container>
          <Flex
            v-show="(results['new']?.data?.value?.data ?? []).length === 0"
            direction="column"
            align="center"
            justify="center"
            gap="40px"
            :style="{ width: '100%', height: '120vh', minHeight: '120vh' }"
          >
            <GokuLoading />
            <h2
              :style="{
                fontSize: !isMobile ? '52px' : '20px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                textShadow: '2px 2px 5px rgba(255,215,0,0.5)',
                margin: '12px 0 !important',
              }"
            >
              Đang tải dữ liệu
            </h2>
          </Flex>
        </ClientOnly>
      </div>
    </div>

    <!-- Main Content -->
    <Box :style="{ padding: isDesktop ? '0 50px' : '0 20px', marginBottom: '60px' }">
      <!-- Xem tiếp -->
      <SectionContainer
        v-if="profileStore.user && historyList?.data?.length"
        title="Xem tiếp"
      >
        <WatchContinuteList :data="historyList.data" :is-loading="isLoadingMovie" />
      </SectionContainer>

      <!-- Xếp hạng -->
      <SectionContainer :title="'Bảng xếp hạng'" v-show="isDesktop">
        <RankingContainer :is-loading="isLoadingMovie"/>
      </SectionContainer>
      <!-- Dynamic Sections -->
      <div   
        v-for="(section, index) in movieSections"
        :key="section.key"
        :ref="el => sectionRefs[section.key] = el as HTMLElement"
      >
        <span style="visibility: hidden; height: 0; overflow: hidden;">{{ JSON.stringify(visibleSections) }}</span>
        <Flex justify="center" align="center" gap="20px" v-if="index > 0 && index % 3 === 0 && isSectionLoading && visibleSections[section.key]">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
        </Flex>
        <Transition name="fade">
          <SectionContainer
            v-if="loadedSections[section.key]"
            :title="section.title"
          >
            <component 
              :is="section.component"
              :data="results[section.key]?.data?.value?.data ?? []"
              :is-loading="results[section.key]?.isLoading"
            />
          </SectionContainer>
        </Transition>
      </div>
    </Box>
  </Box>
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

.swiper-creative-slide::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 200px;
  z-index: 3;
  background: linear-gradient(0deg, rgba(25, 27, 36, 1), rgba(25, 27, 36, 0));
}

swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 4rem;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
  height: 15vh;
}

.swiper-wrapper {
  display: flex;
  flex-direction: column;
}

.slide-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 1rem;
  background:
    radial-gradient(circle at top left, rgba(0,0,0,0.6), transparent 40%),
    radial-gradient(circle at top right, rgba(0,0,0,0.6), transparent 40%),
    radial-gradient(circle at bottom left, rgba(0,0,0,0.6), transparent 40%),
    radial-gradient(circle at bottom right, rgba(0,0,0,0.6), transparent 40%);
  color: #fff;
  z-index: 9999;
}

@keyframes fadeInBlue {
  0% { opacity: 0; transform: translateX(20px); }
  100% { opacity: 1; transform: translateX(0); }
}

.img-slide {
  animation: fadeInBlue .5s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>