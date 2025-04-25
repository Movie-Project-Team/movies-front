<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Flex from '~/components/atoms/Flex.vue';
import FilterContainer from '~/components/molecules/FilterContainer.vue';
import MovieListV2 from '~/components/molecules/MovieListV2.vue';
import Pagination from '~/components/molecules/Pagination.vue';
import { useGetListMovie } from '~/composables/api/movies/use-get-list-movie';
import useResponsive from '~/composables/resize/use-responsive';

const loading = useLoadingStore();
const route = useRoute();
const router = useRouter();

const getQueryString = (value: unknown) => (value ? String(value).trim() : '');
const params = ref({
  item: 21,
  page: Number(route.query.page) || 1,
  keyword: getQueryString(route.query.keyword),
  lang: getQueryString(route.query.lang),
  gen: getQueryString(route.query.gen),
  year: getQueryString(route.query.year),
  type: getQueryString(route.query.type),
  status: getQueryString(route.query.status),
});

const currentPage = ref(Number(route.query.page) || 1);
const { data, refetch, isLoading } = useGetListMovie(params);
const totalPages = computed(() => data.value?.paginate.totalPages ?? 1);

const localLoading = ref(false);
const skeletonLoading = computed(() => localLoading.value || isLoading.value);

watch(
  () => route.query,
  (newQuery) => {
    params.value = {
      ...params.value,
      page: Number(newQuery.page) || 1,
      keyword: getQueryString(newQuery.keyword),
      lang: getQueryString(newQuery.lang),
      gen: getQueryString(newQuery.gen),
      year: getQueryString(newQuery.year),
      type: getQueryString(newQuery.type),
      status: getQueryString(newQuery.status),
    };

    refetch();
  },
  { immediate: true }
);

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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    localLoading.value = false;
  }, 500);
};

// responsive
const { isMobile, isTablet } = useResponsive();
</script>

<template>
  <Flex 
    direction="column" 
    gap="40px"
    :style="{
      padding: (!isMobile && !isTablet) ? '150px 70px 100px' : '50px 20px'
    }"
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
