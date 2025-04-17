<script setup lang="ts">
import MovieCard from '../atoms/MovieCard.vue';
import Flex from '../atoms/Flex.vue';
import Box from '../atoms/Box.vue';
import { useGetListRanking } from '~/composables/api/movies/use-get-list-ranking';

const props = defineProps<{
  type?: string;
}>();

const type = computed(() => props.type ?? "view");
const { data } = useGetListRanking(type);
</script>

<template>
  <ClientOnly>
    <Flex direction="column" align="flex-start" justify="flex-start">
      <Box v-for="(movie, index) in data?.data" :key="`ranking-${movie.id}`" :style="{ width: '100%', padding: '8px 0px' }">
        <MovieCard :data="movie" :is-ver2="true" :pos="index + 1" />
      </Box>
    </Flex>
  </ClientOnly>
</template>

<style scoped></style>
