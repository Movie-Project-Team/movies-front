<script setup lang="ts">
import { useSwiper } from '#imports'
import { ref, computed, defineAsyncComponent, onMounted } from 'vue'
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

// Responsive
const { isDesktop, isMobile } = useResponsive()

// Fetch movie data
const params = ref({ item: 10, keyword: '', year: '2025' })
const { data, isLoading: isLoadingMovie } = useGetListMovie(params)

// Global loading
const loading = useLoadingStore()
watchEffect(() => {
  isLoadingMovie.value ? loading.show() : loading.hide()
})

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
provide('movies', data?.value?.data)

// Fetch history
const profileStore = useProfileStore()
const profileId = computed(() => profileStore.user?.id ?? 1)
const { data: historyList } = useGetListHistory(profileId)

// Shuffle slides
const shuffledSlides = computed(() => {
  const movies = [...(data?.value?.data ?? [])]
  for (let i = movies.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[movies[i], movies[j]] = [movies[j], movies[i]]
  }
  return movies.slice(0, 5)
})

// Dynamic imports
const LazyMovieList = defineAsyncComponent(() => import('~/components/molecules/MovieList.vue'))
const LazyRankingContainer = defineAsyncComponent(() => import('~/components/molecules/RankingContainer.vue'))
const LazyTopSlideSmall = defineAsyncComponent(() => import('~/components/molecules/TopSlideSmall.vue'))

// Intersection flags and refs
const showRankingSection = ref(false)
const rankingSectionRef = ref<HTMLElement | null>(null)
const showNewSection = ref(false)
const newSectionRef = ref<HTMLElement | null>(null)
const showHotSection = ref(false)
const hotSectionRef = ref<HTMLElement | null>(null)

// Observe when sections enter viewport
onMounted(() => {
  if (rankingSectionRef.value) {
    useIntersectionObserver(
      rankingSectionRef,
      ([{ isIntersecting }]) => {
        if (isIntersecting) showRankingSection.value = true
      },
      { threshold: 0.2 }
    )
  }
  if (newSectionRef.value) {
    useIntersectionObserver(
      newSectionRef,
      ([{ isIntersecting }]) => {
        if (isIntersecting) showNewSection.value = true
      },
      { threshold: 0.2 }
    )
  }
  if (hotSectionRef.value) {
    useIntersectionObserver(
      hotSectionRef,
      ([{ isIntersecting }]) => {
        if (isIntersecting) 
        {
          showHotSection.value = true
        }
      },
      { threshold: 0.2 }
    )
  }
})
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
            v-show="shuffledSlides.length > 0"
          >
            <swiper-slide
              v-for="slide in shuffledSlides"
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
            v-show="shuffledSlides.length === 0"
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

      <!-- Bảng xếp hạng (lazy) -->
      <div ref="rankingSectionRef" style="min-height:1px">
        <SectionContainer
          v-if="showRankingSection && isDesktop"
          title="Bảng xếp hạng"
        >
          <LazyRankingContainer
            :data="data?.data ?? []"
            :is-loading="isLoadingMovie"
          />
        </SectionContainer>
      </div>

      <!-- Phim mới (lazy) -->
      <div ref="newSectionRef" style="min-height:1px">
        <SectionContainer v-if="showNewSection" title="Phim mới">
          <LazyMovieList
            :data="data?.data ?? []"
            :is-loading="isLoadingMovie"
          />
        </SectionContainer>
      </div>

      <!-- Phim hot (lazy) -->
      <div ref="hotSectionRef" style="min-height:1px">
        <SectionContainer
          v-if="showHotSection && isDesktop"
          title="Phim hot"
        >
          <LazyTopSlideSmall :data="data?.data ?? []" />
        </SectionContainer>
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
</style>
