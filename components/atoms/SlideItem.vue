<script setup lang="ts">
import { useGetImage } from '@/composables/api/movies/use-get-image';
import Box from './Box.vue';
import Flex from './Flex.vue';
import Tag from './Tag.vue';

const props = defineProps<{
  data: {
    type: string,
    tmdb_id: number,
    title: string,
    imdb: number;
    model: string;
    releaseYear: number;
    totalEpisodes: number;
    genres: string[];
    description: string;
  };
}>();

const config = useRuntimeConfig();
const typeRef = computed(() => props.data.type);
const tmdbIdRef = computed(() => props.data.tmdb_id.toString());

const { data: image } = useGetImage(typeRef, tmdbIdRef);
const firstLogoUrl = computed(() => {
  return image.value?.logos?.length ? image.value.logos[0].file_path : null;
});
</script>

<template>
  <Flex direction="column" justify="center" class="slide-content">
    <NuxtImg
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
    />
    <h2
      v-else
      :style="{
        fontSize: '52px',
        marginBottom: '16px!important'
      }"
    >
      {{ data.title }}
    </h2>
    <Flex gap="10px" direction="column"> 
      <Flex gap="8px">
        <Tag :content="data.imdb" :sub-content="'IMBd'" :type="'imdb'"/>
        <Tag :content="data.model" :type="'background'"/>
        <Tag :content="data.releaseYear" :type="'classic'"/>
        <Tag :content="data.totalEpisodes" :sub-content="'Tập'" :type="'classic'"/>
      </Flex>
      <Flex gap="8px">
        <Tag v-for="(genre, index) in data.genres" :key="index" :content="genre" :type="'topic'"/>
      </Flex>
      <Box 
        :style="{
          fontSize: '1rem',
          lineHeight: 1.6,
          color: '#fff',
          textShadow: '0 1px 1px rgba(0, 0, 0, .2)',
          fontWeight: 400,
          marginBottom: '2rem',
        }"
      >
        {{ data.description }}
      </Box>
    </Flex>
    <Button 
      label="Xem ngay"
      icon="pi pi-play-circle"
      aria-label="Filter" 
      :style="{
        width: '170px',
        padding: '15px 31px',
      }"/>
  </Flex>
</template>

<style scoped></style>
