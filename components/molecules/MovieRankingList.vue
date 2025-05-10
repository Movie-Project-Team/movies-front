<script setup lang="ts">
import MovieCard from '../atoms/MovieCard.vue';
import Flex from '../atoms/Flex.vue';
import Box from '../atoms/Box.vue';
import { useGetListRanking } from '~/composables/api/movies/use-get-list-ranking';
import { Skeleton } from 'primevue';

const props = defineProps<{
  type?: string;
}>();

const type = computed(() => props.type ?? "view");
const { data, isFetching } = useGetListRanking(type);
</script>

<template>
  <ClientOnly>
    <Flex direction="column" align="flex-start" justify="flex-start">
      <Flex v-if="isFetching" gap="12px" direction="column">
        <Flex justify="center" align="center" wrap="wrap" gap="4px" v-for="_ in 5">    
          <Skeleton width="25px" height="25px"/>
          <Skeleton width="25px" height="37.5px"/>
          <Skeleton width="10rem" />
        </Flex>
      </Flex>
      <Box v-else v-for="(movie, index) in data?.data" :key="`ranking-${movie.id}`" :style="{ width: '100%', padding: '8px 0px' }">
        <MovieCard :data="movie" :is-ver2="true" :pos="index + 1" />
      </Box>
    </Flex>
  </ClientOnly>
</template>

<style scoped></style>
