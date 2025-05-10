<script setup lang="ts">
import Box from '~/components/atoms/Box.vue';
import Flex from '~/components/atoms/Flex.vue';
import Tag from '~/components/atoms/Tag.vue';
import DetailInfoTab from '~/components/molecules/DetailInfoTab.vue';
import { useGetMovie } from '~/composables/api/movies/use-get-movie';
import useResponsive from '~/composables/resize/use-responsive';

const route = useRoute();
const router = useRouter();
const loading = useLoadingStore();

const slug = computed(() => 
  Array.isArray(route.params.title) ? route.params.title[0] : route.params.title
);
const { data, isLoading: isLoadingDetailMovie } = useGetMovie(slug);
const movie = computed<Movie>(() => data.value?.data ?? ({} as Movie));

watchEffect(() => {
  if (isLoadingDetailMovie.value || !data.value) {
    loading.show();
  } else {
    loading.hide();
  }
});

const plainDescription = computed(() => {
  return (movie.value.description || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
});

const tagItems = computed(() => [
  { content: movie.value.vote_average ?? "N/A", subContent: "IMBd", type: "imdb" },
  { content: "T12", type: "background" },
  { content: movie.value.year ?? "N/A" },
  { 
    content: movie.value.season 
      ? `Phần ${movie.value.season}` 
      : "Chưa cập nhật" 
  },
  { 
    content: movie.value.esp_total 
      ? movie.value.esp_total.toString().includes("Tập") 
        ? movie.value.esp_total 
        : `Tập ${movie.value.esp_total}` 
      : "Chưa cập nhật" 
  }
]);

const posterSrc = computed(() => movie.value.poster || 'https://m.economictimes.com/thumb/msid-104359417,width-1200,height-900,resizemode-4,imgsize-54656/cinema-halls1.jpg')

const genreItems = [
  { content: "Hành Động", type: "topic" },
  { content: "Viễn Tưởng", type: "topic" },
  { content: "Phiêu Lưu", type: "topic" },
  { content: "Khoa Học", type: "topic" }
];

const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/\s+/g, "-");
};

const goToDetail = (slug: any) => {
  router.push({ 
    path: `/xem-phim/${slug}`, 
    query: { server: toSlug(String(movie.value.episodes[0].server_name)), ep: 1 } 
  });
};

useHead(() => ({
  title: movie.value.title ? `${movie.value.title} - Xem Phim Online` : 'Đang tải...'
}));

// responsive
const { isMobile, isTablet, isLaptop, isDesktop } = useResponsive();
</script>

<template>
  <Box
    :style="{
      padding: (!isMobile && !isTablet) ? '150px 70px 100px' : '50px 20px'
    }"
  >
    <Flex 
      gap="60px"
      :style="{
        position: 'relative',
        height: (!isMobile && !isTablet) ? 'auto' : '500px',
      }"
      v-show="movie.title"
      :justify="(!isMobile && !isTablet) ? 'flex-start' : 'center'"
    >
      <Flex
        direction="column"
        :align="(!isMobile && !isTablet) ? 'flex-start' : 'center'"
        gap="10px"
        :style="{
          width: (!isMobile && !isTablet) ? '40%' : '90%',
          position: (!isMobile && !isTablet) ? 'relative' : 'absolute',
          bottom: '0',
          zIndex: (!isMobile && !isTablet) ? '0' : '10',
        }"
      >
        <Skeleton width="80%" height="30px" v-show="!data?.data" />
        <NuxtImg 
          v-show="isMobile || isTablet"
          :src="movie.thumbnail" 
          :alt="movie.thumbnail"
          format="webp"
          loading="lazy"
          :style="{ 
            width: '104px',
            maxWidth: '104px',
            borderRadius: '8px',
            minHeight: '165px',
          }"
          @mouseover="(e: any) => e.currentTarget.style.opacity = '0.7'"
          @mouseleave="(e: any) => e.currentTarget.style.opacity = '1'"
        />
        <h1
          :style="{
            fontSize: (!isMobile && !isTablet) ? '52px' : '20px',
            textAlign: (!isMobile && !isTablet) ? 'start' : 'center',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            textShadow: '2px 2px 5px rgba(255, 215, 0, 0.5)',
            margin: '12px 0px !important',
          }"
          class="fade-in"
        >
        {{ movie?.title ?? 'Chưa có tiêu đề' }}
        </h1>
        <Flex direction="column" :gap="(!isMobile && !isTablet) ? '12px' : '40px'" class="fade-in">
          <Flex
            gap="10px"
            :style="{
              height: '26px',
            }"
            :wrap="(!isMobile && !isTablet) ? 'nowrap' : 'wrap'"
            :justify="(!isMobile && !isTablet) ? 'flex-start' : 'center'"
          >
            <Tag
              v-for="(tag, index) in tagItems"
              :key="index"
              :content="tag.content"
              :sub-content="tag.subContent"
              :type="tag.type"
            />
          </Flex>
          <Flex
            gap="10px"
            :style="{
              height: '26px'
            }"
            :wrap="(!isMobile && !isTablet) ? 'nowrap' : 'wrap'"
            :justify="(!isMobile && !isTablet) ? 'flex-start' : 'center'"
            class="fade-in"
          >
            <Tag
              v-for="(genre, index) in genreItems"
              :key="index"
              :content="genre.content"
              :type="genre.type"
            />
          </Flex>
        </Flex>
        <Flex direction="column" gap="10px" v-show="(!isMobile && !isTablet)" class="fade-in"> 
          <Flex :style="{ margin: '4px 0px!important' }" gap="8px">
            <span :style="{ fontWeight: '700' }">Đạo diễn: </span>
            <Skeleton width="80%" height="25px" v-show="!data?.data" />
            <span v-show="data?.data">{{ movie.produce_by ?? "Chưa cập nhật" }}</span>
          </Flex>
          <p :style="{ margin: '4px 0px!important' }">
            <span :style="{ fontWeight: '700' }">Diễn viên: </span>
            Taito Ban, Genta Nakamura, Haruna Mikawa
          </p>
        </Flex>
        <Box v-show="(!isMobile && !isTablet)" class="fade-in">
          <p :style="{ margin: '4px 0px!important', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '4', overflow: 'hidden' }">
            <span :style="{ fontWeight: '700' }">Giới thiệu: </span>
            <Skeleton width="100%" height="40px" v-show="!data?.data" />
            <span v-show="data?.data">{{ plainDescription }}</span>
          </p>
        </Box>
        <Flex :style="{ marginTop: (!isMobile && !isTablet) ? '20px' : '40px', width: '100%' }" gap="10px" :direction="(!isMobile && !isTablet) ? 'row' : 'column'">
          <Button label="Xem phim" icon="pi pi-play" @click="goToDetail(movie.slug)" :rounded="(!isMobile && !isTablet) ? false : true"/>
          <Flex gap="8px" justify="center">
            <Button :label="(!isMobile && !isTablet) ? 'Yêu thích' : ''" icon="pi pi-heart" :rounded="(!isMobile && !isTablet) ? false : true" :raised ="(!isMobile && !isTablet) ? false : true" :style="{ background: 'rgb(45, 47, 52)', border: 'none' }" />
            <Button :label="(!isMobile && !isTablet) ? 'Xem sau' : ''" icon="pi pi-bookmark" :rounded="(!isMobile && !isTablet) ? false : true" :raised ="(!isMobile && !isTablet) ? false : true" :style="{ background: 'rgb(45, 47, 52)', border: 'none' }" />
          </Flex>
        </Flex>
      </Flex>
      <Flex
        justify="center"
        :style="{
          position: 'relative',
          width: (!isMobile && !isTablet) ? '60%' : '100%',
        }"
      >
        <Box
          :style="{
            width: '100%',
          }"
          class="image-wrapper"
        >
          <NuxtImg 
            fit="cover" 
            :src="posterSrc" 
            alt="" 
            class="poster-image"
            :style="{ 
              width: '100%',
              height: '100%',
              maxHeight: (!isMobile && !isTablet) ? '480px' : '165px',
              objectFit: 'cover',
              maskImage: (isMobile || isTablet) ? 'linear-gradient(360deg, transparent 0, #000 50%, #000 50%, transparent)' : 'none',
              WebkitMaskImage: (isMobile || isTablet) ? 'linear-gradient(360deg, transparent 0, #000 50%, #000 50%, transparent)' : 'none',
              opacity: (isMobile || isTablet) ? '.1' : '1'
            }"
          />
          <Box class="overlay1"></Box>
          <Box class="overlay2"></Box>
          <Box class="overlay3"></Box>
          <Box class="overlay4"></Box>
        </Box>
      </Flex>
    </Flex>
    <Flex :style="{ width: '100%', height: '100vh' }" justify="center" align="center" v-show="!movie.title">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent"
       animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </Flex>
    <DetailInfoTab :esp-current="movie?.esp_current" :movie="movie" :style="{ width: '100%' }"/>
  </Box>
</template>

<style scoped>
@keyframes fadeInBlue {
  0% {
    opacity: 0;
    transform: translateX(20px);
    
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.fade-in {
  animation: fadeInBlue .5s ease-in-out;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 480px; /* hoặc chiều cao bạn muốn */
  background-color: #00031c;
  overflow: hidden;
}

.poster-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.3; /* hoặc 0.1 tùy bạn muốn nền ảnh mờ cỡ nào */
}

.overlay1 {
  position: absolute;
  height: 200px;
  top: -20%;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, transparent, #00031c, #00031c);
}

.overlay2 {
  position: absolute;
  height: 200px;
  top: 70%;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent, #00031c, #00031c);
}

.overlay3 {
  position: absolute;
  height: 100%;
  top: 0;
  left: -95%;
  right: 0;
  bottom: 0;
  background: linear-gradient(to left, transparent, #00031c, #00031c);
}

.overlay4 {
  position: absolute;
  height: 100%;
  top: 0;
  left: 95%;
  right:0;
  bottom: 0;
  background: linear-gradient(to right, transparent, #00031c, #00031c);
}
</style>
