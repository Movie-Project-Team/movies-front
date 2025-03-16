<script setup lang="ts">
import Flex from '../atoms/Flex.vue';
import MovieCard from '../atoms/MovieCard.vue';
import SkeletonContainer from '@/components/molecules/SkeletonContainer.vue';

const props = defineProps<{
  data: Movie[] | MovieTmdb[] | undefined;
  isLoading?: boolean;
}>();

const loadingState = ref(props.isLoading);
watch(() => props.isLoading, (newValue) => {
  loadingState.value = newValue;
});
</script>

<template>
  <ClientOnly>
    <SkeletonContainer v-show="loadingState" type="list" :number-data="21"/>
    <Flex v-show="!loadingState" gap="30px" wrap="wrap" justify="center" align="center">
      <MovieCard v-for="movie in data" :data="movie"/>
    </Flex>
  </ClientOnly>
</template>

<style scoped></style>
