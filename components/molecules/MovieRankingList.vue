<script setup lang="ts">
import MovieCard from '../atoms/MovieCard.vue';
import Flex from '../atoms/Flex.vue';
import Box from '../atoms/Box.vue';

const props = defineProps<{
  data: Movie[];
}>();
</script>

<template>
  <ClientOnly>
    <Flex direction="column" align="flex-start" justify="flex-start">
      <Box v-for="(movie, index) in data.slice(0, 5)" :key="index" :style="{ width: '100%', padding: '8px 0px' }">
        <MovieCard :data="movie" :is-ver2="true" :pos="index + 1" :key="movie.id"/>
      </Box>
    </Flex>
  </ClientOnly>
</template>

<style scoped></style>
