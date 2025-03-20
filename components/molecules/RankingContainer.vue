<script setup lang="ts">
import Flex from '../atoms/Flex.vue';
import MovieRankingList from '@/components/molecules/MovieRankingList.vue';
import SkeletonContainer from './SkeletonContainer.vue';

const props = defineProps<{
  data: Movie[];
  isLoading?: boolean
}>();

const loadingState = ref(props.isLoading);
watch(() => props.isLoading, (newValue) => {
  loadingState.value = newValue;
});

const rankingList = [
  {
    label: 'LƯỢT XEM',
    icon: 'pi pi-eye',
    type: 'view'
  },
  {
    label: 'ĐÁNH GIÁ',
    icon: 'pi pi-eye',
    type: 'vote_count'
  },
  {
    label: 'MỚI CẬP NHẬT',
    icon: 'pi pi-eye',
    type: 'updated_at'
  },
  {
    label: 'LƯỢT XEM',
    icon: 'pi pi-eye',
    type: 'view'
  }
]
</script>

<template>
  <Flex :style="{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #fff2' }">
    <Flex v-for="item in rankingList" direction="column" :style="{ width: '25%', borderRight: '1px solid #fff2', padding: '24px' }">
      <Flex gap="8px" :style="{ padding: '0px 0px 12px' }">
        <i :class="item.icon" />
        <span :style="{ fontSize: '13px', fontWeight: '600' }">{{ item.label }}</span>
      </Flex>
      <SkeletonContainer v-show="loadingState" type="ranking" :number-data="4"/>
      <MovieRankingList v-show="!loadingState" :type="item.type"/>
    </Flex>
  </Flex>
</template>

<style scoped></style>
