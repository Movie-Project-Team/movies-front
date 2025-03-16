<script setup lang="ts">
import Box from './Box.vue';
import Flex from './Flex.vue';
import { formatDate } from '~/utils/date';

const props = defineProps<{
  data: Movie | MovieTmdb;
  isVer2?: boolean
  pos?: number
}>();

const config = useRuntimeConfig();
const movieStore = useMovieStore();
const isMovie = (data: Movie | MovieTmdb): data is Movie => {
  return (data as Movie).slug !== undefined;
};

const router = useRouter();
const goToDetail = () => {
  if (isMovie(props.data)) {
    movieStore.setMovieId(props.data.id);
    router.push(`/phim/${props.data.slug}`);
  }
};

const defaultPoster = 'https://cdn.iconscout.com/icon/premium/png-512-thumb/film-error-12036009-9808452.png?f=webp&w=256';

const imageSrc = computed(() => {
  if (isMovie(props.data)) {
    return props.data.thumbnail || defaultPoster;
  }
  return props.data.poster_path ? `${config.public.imageTmdbDomain}/${props.data.poster_path}` : defaultPoster;
});

const formattedReleaseDate = computed(() => {
  return !isMovie(props.data) && props.data.release_date
    ? formatDate(new Date(props.data.release_date), "DD-MM-YYYY")
    : "";
});

</script>

<template>
  <Flex 
    align="center" 
    gap="12px" 
    @click="goToDetail"
    :direction="isVer2 ? 'row' : 'column'" 
    :justify="isVer2 ? 'flex-start' : 'center'" 
    :style="{ cursor: 'pointer', maxWidth: '221px', }"
  >
    <Box
      :style="{
        fontWeight: '700',
        fontSize: '18px',
        opacity: '.3'
      }"
      v-if="isVer2"
      v-bind="$attrs"
    >
      {{ pos }}.
    </Box>
    <Box :style="{ position: 'relative' }">
      <NuxtImg 
        :src="imageSrc" 
        :alt="data.title"
        format="webp"
        loading="lazy"
        :style="{ 
          width: isVer2 ? '25px' : '221px',
          borderRadius: isVer2 ? '0px' : '8px',
          minHeight: isVer2 ? '0px' : '330px',
        }"
        :placeholder="[50, 25, 75, 5]"
        @mouseover="(e: any) => e.currentTarget.style.opacity = '0.7'"
        @mouseleave="(e: any) => e.currentTarget.style.opacity = '1'"
      />
      <Box
        v-if="!isVer2"
        :style="{
          position:'absolute',
          bottom: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
          overflow: 'hidden',
          background: '#5e6070',
          borderRadius: '.3rem .3rem 0 0',
          boxShadow: '0 0 5px 2px rgba(0, 0, 0, .1)',
          padding: '0 6px'
        }"
      >
        <h1 
          :style="{
            textAlign: 'center',
            fontSize: '10px',
          }"
        >P.Đề</h1>
      </Box>
    </Box>
    <h4 
      :style="{ 
        fontSize: isVer2 ? '12px' : '14px',
        margin: '0px',
        display: '-webkit-box', 
        WebkitBoxOrient: 'vertical', 
        WebkitLineClamp: '1', 
        overflow: 'hidden'
      }"
    >
      {{ data.title }}
    </h4>
    <p v-if="!isMovie(props.data)" :style="{ fontSize: '14px', opacity: 0.6, margin: '0px' }">
      {{ formattedReleaseDate }}
    </p>
  </Flex>
</template>

<style scoped></style>
