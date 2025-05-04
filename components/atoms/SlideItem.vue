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

// const config = useRuntimeConfig();
// const typeRef = computed(() => props.data?.type || 'movie'); 
// const tmdbIdRef = computed(() => props.data?.tmdb_id ? String(props.data.tmdb_id) : '');
// const { data: tvTMDB } = useGetMovieById(tmdbIdRef, typeRef);

// const resolvedTmdb = computed(() => {
//   if (typeRef.value === "tv" && tvTMDB.value?.tv_results?.[0]?.id) {
//     return String(tvTMDB.value.tv_results[0].id);
//   }
//   return tvTMDB.value?.movie_results.id ?? "113268";
// });

// const { data: image } = useGetImage(typeRef as Ref<string>, resolvedTmdb as Ref<string>);

// const firstLogoUrl = computed(() => {
//   return image.value?.logos?.length ? image.value.logos[0].file_path : null;
// });

// responsive
const { isMobile, isTablet, isLaptop, isDesktop } = useResponsive();
</script>

<template>
  <Flex class="slide-content" :style="{ padding: '100px 50px'}">
    <Flex direction="column" justify="center" class="slide-item" :gap="isMobile ? '16px' : '0px'" :style="{ width: '600px' }">
      <!-- <NuxtImg
        v-if="firstLogoUrl" 
        :src="`${config.public.imageTmdbDomain}/${firstLogoUrl}`"
        :alt="`${config.public.imageTmdbDomain}/${firstLogoUrl}`"
        :style="{
          maxWidth: '500px',
          maxHeight: '130px',
          marginBottom: '40px'
        }"
        loading="lazy"
        fit="cover"
      /> -->
      <h2
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
            maxWidth: '50%'
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
