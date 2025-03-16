<script setup lang="ts">
import Flex from '../atoms/Flex.vue';
import MovieRankingList from '@/components/molecules/MovieRankingList.vue';
import SkeletonContainer from '@/components/molecules/SkeletonContainer.vue';

const props = defineProps<{
  data: Movie[];
  isLoading?: boolean
}>();

const loadingState = ref(props.isLoading);
watch(() => props.isLoading, (newValue) => {
  loadingState.value = newValue;
});
</script>

<template>
  <Flex :style="{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #fff2' }">
    <Flex direction="column" :style="{ width: '25%', borderRight: '1px solid #fff2', padding: '24px' }">
      <Flex gap="8px">
        <i class="pi pi-eye" />
        <span :style="{ fontSize: '13px', fontWeight: '600' }">LƯỢT XEM</span>
      </Flex>
      <SkeletonContainer v-show="loadingState" type="ranking" :number-data="4"/>
      <MovieRankingList v-show="!loadingState" :data="data"/>
    </Flex>
    <Flex direction="column" :style="{ width: '25%', borderRight: '1px solid #fff2', padding: '24px' }">
      <Flex gap="8px">
        <i class="pi pi-eye" />
        <span :style="{ fontSize: '13px', fontWeight: '600' }">LƯỢT XEM</span>
      </Flex>
      <SkeletonContainer v-show="loadingState" type="ranking" :number-data="4"/>
      <MovieRankingList :data="data"/>
    </Flex>
    <Flex direction="column" :style="{ width: '25%', borderRight: '1px solid #fff2', padding: '24px' }">
      <Flex gap="8px">
        <i class="pi pi-eye" />
        <span :style="{ fontSize: '13px', fontWeight: '600' }">LƯỢT XEM</span>
      </Flex>
      <SkeletonContainer v-show="loadingState" type="ranking" :number-data="4"/>
      <MovieRankingList :data="data"/>
    </Flex>
    <Flex direction="column" :style="{ width: '25%', padding: '24px' }">
      <Flex gap="8px">
        <i class="pi pi-eye" />
        <span :style="{ fontSize: '13px', fontWeight: '600' }">LƯỢT XEM</span>
      </Flex>
      <SkeletonContainer v-show="loadingState" type="ranking" :number-data="4"/>
      <MovieRankingList :data="data"/>
    </Flex>
  </Flex>
</template>

<style scoped></style>
