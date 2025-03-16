<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Flex from '~/components/atoms/Flex.vue';
import FilterContainer from '~/components/molecules/FilterContainer.vue';
import MovieListV2 from '~/components/molecules/MovieListV2.vue';
import Pagination from '~/components/molecules/Pagination.vue';
import { useGetListMovie } from '~/composables/api/movies/use-get-list-movie';

const loading = useLoadingStore();
const route = useRoute();
const router = useRouter();

const params = ref({
  item: 21,
  page: Number(route.query.page) || 1,
  keyword: '',
});
const currentPage = ref(Number(route.query.page) || 1);
const { data, refetch, isLoading } = useGetListMovie(params);
const totalPages = computed(() => data.value?.paginate.totalPages ?? 1);

// local loading state dùng để đảm bảo skeleton hiển thị ít nhất 500ms
const localLoading = ref(false);
const skeletonLoading = computed(() => localLoading.value || isLoading.value);

watch(() => route.query.page, (newPage) => {
  const pageNumber = Number(newPage) || 1;
  params.value.page = pageNumber;
  currentPage.value = pageNumber;
  refetch();
});

const setLoading = () => {
  loading.show();
  setTimeout(() => {
    loading.hide();
  }, 2000);
};

const changePage = async (page: number) => {
  if (page < 1 || page > totalPages.value) return;

  localLoading.value = true;
  params.value.page = page;
  currentPage.value = page;
  router.push({ query: { ...route.query, page } });

  setLoading();
  await refetch();
  setTimeout(() => {
    localLoading.value = false;
  }, 500);
};
</script>

<template>
  <Flex 
    direction="column" 
    gap="40px"
    :style="{ padding: '150px 70px 100px' }"
  >
    <h1 :style="{ margin: '4px 0px' }">Tìm kiếm</h1>
    <FilterContainer />
    <MovieListV2 :data="data?.data" :is-loading="skeletonLoading" />
    <Pagination 
      v-if="!skeletonLoading" 
      :currentPage="currentPage" 
      :totalPages="totalPages" 
      @changePage="changePage" 
    />
  </Flex>
</template>

<style scoped></style>
