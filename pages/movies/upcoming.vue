<script setup lang="ts">
import Flex from '~/components/atoms/Flex.vue';
import MonthBox from '~/components/atoms/MonthBox.vue';
import MovieListV2 from '~/components/molecules/MovieListV2.vue';
import { useGetListUpcoming } from '~/composables/api/movies/use-get-list-upcoming';
import { getMonthRange } from "~/utils/date";
import Pagination from '~/components/molecules/Pagination.vue';

const loading = useLoadingStore();
const months = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);
const { firstDay: firstDayOfYear, lastDay: lastDayOfYear } = getMonthRange(0);

const params = ref({
  "primary_release_date.gte": firstDayOfYear,
  "primary_release_date.lte": lastDayOfYear,
  "with_origin_country": "VN|US|KR|TH",
  "with_original_language": "vi|en|ko|th",
  "page": 1,
});
const { data, refetch } = useGetListUpcoming(params);

const currentPage = ref(1);
const totalPages = computed(() => data.value?.total_pages ?? 1);

const setLoading = () => {
  loading.show();
  setTimeout(() => {
    loading.hide();
  }, 2000);
};

const selectMonth = (monthIndex: number) => {
  const { firstDay, lastDay } = getMonthRange(monthIndex);

  params.value = {
    ...params.value,
    "primary_release_date.gte": firstDay,
    "primary_release_date.lte": lastDay,
    "page": 1,
  };
  currentPage.value = 1;
  refetch();
  setLoading();
};

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;

  params.value.page = page;
  currentPage.value = page;
  refetch();
  setLoading();
};
</script>

<template>
  <Flex 
    direction="column" 
    gap="40px"
    :style="{
      padding: '150px 70px 100px'
    }"
  >
    <h1 :style="{ margin: '4px 0px' }">Phim sắp chiếu</h1>
    <Flex gap="20px">
      <MonthBox v-for="(month, index) in months" :key="index" :label="month" @click="selectMonth(index)" />
    </Flex>
    <MovieListV2 :data="data?.results ?? []" />
    <Pagination :currentPage="currentPage" :totalPages="totalPages" @changePage="changePage" />
  </Flex>
</template>

<style scoped>

</style>
