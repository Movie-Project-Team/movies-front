<script setup lang="ts">
import { useGetImage } from '@/composables/api/movies/use-get-image';
import Box from './Box.vue';
import Flex from './Flex.vue';
import Tag from './Tag.vue';
import { useGetMovieById } from '~/composables/api/movies/use-get-by-id';
import useResponsive from '@/composables/resize/use-responsive';

const props = defineProps<{
  data: Movie;
}>();

const tagItems = computed(() => [
  { content: props.data.vote_average ?? "N/A", subContent: "IMBd", type: "imdb" },
  { content: "T12", type: "background" },
  { content: props.data.year ?? "N/A" },
  { 
    content: props.data.season 
      ? `Phần ${props.data.season}` 
      : "Chưa cập nhật" 
  },
  { 
    content: props.data.esp_total 
      ? props.data.esp_total.toString().includes("Tập") 
        ? props.data.esp_total 
        : `${props.data.esp_total} Tập ` 
      : "Chưa cập nhật" 
  }
]);

const genreItems = [
  { content: "Hành Động", type: "topic" },
  { content: "Viễn Tưởng", type: "topic" },
  { content: "Phiêu Lưu", type: "topic" },
  { content: "Khoa Học", type: "topic" }
];

const plainDescription = computed(() => {
  return (props.data.description || 'Chưa cập nhật')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
});

const config = useRuntimeConfig();
const currentRef = computed(() => props.data?.esp_current || 'movie'); 
const typeRef = computed(() => props.data?.esp_current == "Full" ? "movie" : "tv");
const tmdbIdRef = computed(() => props.data?.imdb ? String(props.data.imdb) : '');
const { data: tvTMDB } = useGetMovieById(tmdbIdRef, currentRef);

const resolvedTmdb = computed(() => {
  if (!tvTMDB.value) return null;
  
  if (currentRef.value === "Full") {
    return tvTMDB.value.movie_results?.[0]?.id 
      ? String(tvTMDB.value.movie_results[0].id) 
      : null;
  }
  
  return tvTMDB.value.tv_results?.[0]?.id 
    ? String(tvTMDB.value.tv_results[0].id) 
    : null;
});
const { data: image } = useGetImage(typeRef as Ref<string>, resolvedTmdb as Ref<string>);

const firstLogoUrl = computed(() => {
  return image.value?.logos?.length ? image.value.logos[0].file_path : null;
});

// responsive
const { isMobile, isTablet, isLaptop, isDesktop } = useResponsive();
</script>

<template>
  <Flex class="slide-content" :style="{ padding: '100px 50px'}">
    <Flex direction="column" justify="center" class="slide-item" :gap="isMobile ? '16px' : '0px'" :style="{ width: '600px' }">
      <NuxtImg
        v-if="firstLogoUrl" 
        :src="`${config.public.imageTmdbDomain}/${firstLogoUrl}`"
        :alt="`${config.public.imageTmdbDomain}/${firstLogoUrl}`"
        :style="{
          maxWidth: '500px',
          maxHeight: '170px',
          marginBottom: '40px'
        }"
        loading="lazy"
        fit="cover"
      />
      <h2
        v-else
        :style="{
          fontSize: isDesktop ? '52px' : '24px',
          textAlign: isMobile ? 'center' : 'start',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          textShadow: '2px 2px 5px rgba(255, 215, 0, 0.5)',
          margin: '12px 0px !important',
        }"
      >
        {{ data.title }}
      </h2>
      <Flex gap="10px" direction="column"> 
        <Flex gap="8px" :justify="isMobile ? 'center' : 'flex-start'">
          <Tag
            v-for="(tag, index) in tagItems"
            :key="index"
            :content="tag.content"
            :sub-content="tag.subContent"
            :type="tag.type"
          />
        </Flex>
        <Flex gap="8px" :justify="isMobile ? 'center' : 'flex-start'">
          <Tag v-for="(genre, index) in genreItems" :key="index" :content="genre.content" :type="'topic'"/>
        </Flex>
        <Box 
          :style="{
            fontSize: '1rem',
            lineHeight: 1.6,
            color: '#fff',
            textShadow: '0 1px 1px rgba(0, 0, 0, .2)',
            fontWeight: 400,
            marginBottom: '2rem',
            display: '-webkit-box', 
            WebkitBoxOrient: 'vertical', 
            WebkitLineClamp: '3', 
            overflow: 'hidden',
          }"
          v-show="isDesktop"
        >
          {{ plainDescription }}
        </Box>
      </Flex>
      <Flex :justify="isMobile ? 'center' : 'flex-start'" :style="{ width: '100%' }">
        <Button 
          label="Xem ngay"
          icon="pi pi-play-circle"
          aria-label="Filter" 
          :style="{
            width: '170px',
            padding: '15px 31px',
          }"/>
      </Flex>
    </Flex>
  </Flex>
</template>

<style scoped>
@keyframes fadeInBlue {
  0% {
    opacity: 0;
    transform: translateX(-20px);
    
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}

.slide-item {
  animation: fadeInBlue .5s ease-in-out;
}
</style>