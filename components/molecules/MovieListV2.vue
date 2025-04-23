<script setup lang="ts">
import useResponsive from '~/composables/resize/use-responsive';
import Flex from '../atoms/Flex.vue';
import MovieCard from '../atoms/MovieCard.vue';
import SkeletonContainer from './SkeletonContainer.vue';

const props = defineProps<{
  data: Movie[] | MovieTmdb[] | undefined;
  isLoading?: boolean;
}>();

const loadingState = ref(props.isLoading);
watch(() => props.isLoading, (newValue) => {
  loadingState.value = newValue;
});

// responsive
const { isMobile, isTablet, isLaptop, isDesktop } = useResponsive();
</script>

<template>
  <ClientOnly>
    <SkeletonContainer v-show="loadingState" type="list" :number-data="21"/>
    <Flex v-show="!loadingState" :gap="(!isMobile && !isTablet) ? '30px' : '18px'" wrap="wrap" :justify="(!isMobile && !isTablet) ? 'center': 'space-between'" align="center">
      <MovieCard v-for="movie in data" :data="movie"/>
    </Flex>
  </ClientOnly>
</template>

<style scoped></style>
