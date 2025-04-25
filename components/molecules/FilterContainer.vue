<script setup lang="ts">
import { useGetListLanguage } from '~/composables/api/util/use-get-list-language';
import ActiveList from '../atoms/ActiveList.vue';
import { useGetListGenres } from '~/composables/api/util/use-get-list-genres';
import { nextTick, ref, watchEffect, computed } from 'vue';

const loading = useLoadingStore();
const router = useRouter();
const route = useRoute();
const selectedFilters = ref<Record<string, string | null>>({
  lang: null,
  gen: null,
  year: null,
  rating: null,
  status: null,
  type: null,
});
const { data: languageResponse, isLoading: isLoadingLanguage } = useGetListLanguage();
const { data: genresResponse, isLoading: isLoadingGenres } = useGetListGenres();

const formatData = (response: any) => {
  const list = response?.value?.data?.map((item: any) => ({
    title: item.title,
    slug: item.slug,
  })) || [];
  return [
    { title: 'Tất cả', slug: '' },
    ...list,
  ];
};

const languageData = ref<string[]>([]);
const genresData = ref<string[]>([]);

watchEffect(() => {
  if (languageResponse?.value?.data) {
    languageData.value = formatData(languageResponse);
  }
});

watchEffect(() => {
  if (genresResponse?.value?.data) {
    genresData.value = formatData(genresResponse);
  }
});

watchEffect(async () => {
  if (languageData.value.length > 0 && genresData.value.length > 0) {
    await nextTick();
    loading.hide();
  } else {
    loading.show();
  }
});

const typeData = [
  { title: 'Tất cả', slug: '' },
  { title: 'Phim lẻ', slug: 'single' },
  { title: 'Phim bộ', slug: 'series' },
  { title: 'TV Shows', slug: 'tvshows' },
  { title: 'Phim hoạt hình', slug: 'hoathinh' },
];

const getYearItems = () => {
  const current = new Date().getFullYear();
  const years: string[] = [];
  
  for (let i = 0; i < 5; i++) {
    years.push(String(current - i));
  }

  years.push(`Trước ${current - 4}`);
  
  return ['Tất cả', ...years];
};

const filterDataList = computed(() => [
  {
    label: "Thể loại",
    items: genresData.value,
  },
  {
    label: "Quốc gia",
    items: languageData.value,
  },
  {
    label: "Năm phát hành",
    items: getYearItems(),
  },
  {
    label: "Đánh giá",
    items: ["Tất cả", "⭐ 5 sao", "⭐ 4 sao", "⭐ 3 sao", "⭐ 2 sao", "⭐ 1 sao"],
  },
  {
    label: "Trạng thái phim",
    items: ["Tất cả", "Đang chiếu", "Hoàn thành"],
  },
  {
    label: "Loại phim",
    items: typeData,
  },
]);

const setFilter = (label: string, value: string) => {
  const queryKeyMap: Record<string, string> = {
    "Thể loại": "gen",
    "Quốc gia": "lang",
    "Năm phát hành": "year",
    "Đánh giá": "rating",
    "Trạng thái phim": "status",
    "Loại phim": "type",
  };

  const queryKey = queryKeyMap[label];
  if (queryKey) {
    selectedFilters.value[queryKey] = value !== "Tất cả" ? value : null;
  }
};

const applyFilters = () => {
  const params = new URLSearchParams();
  Object.entries(selectedFilters.value)
    .filter(([, v]) => v !== null)
    .forEach(([k, v]) => {
      params.append(k, v as string);
    });
  params.set('page', '1');
  window.location.href = `/tim-kiem?${params.toString()}`;
};

const filterKeys = ['lang', 'gen', 'year', 'rating', 'status', 'type'] as const;
watch(
  () => route.query,
  (q) => {
    filterKeys.forEach(key => {
      const raw = q[key];
      selectedFilters.value[key] = raw != null ? String(raw).trim() : null;
    });
  },
  { immediate: true }
);

const skeletonLoading = computed(() => isLoadingLanguage.value || isLoadingGenres.value);
</script>

<template>
  <div class="card">
    <Fieldset legend="Bộ lọc" :toggleable="true">
      <div v-for="(data, index) in filterDataList" :key="index">
        <Skeleton v-show="skeletonLoading" width="100%" height="60px" :style="{ marginBottom: '20px' }"/>
        <ActiveList v-show="!skeletonLoading" :data="data" @update="setFilter(data.label, $event)" />
        <Divider style="--p-divider-border-color: #ffffff10"/>
      </div>   
      <Button :style="{ width: '200px', marginTop: '20px' }" icon="pi pi-arrow-right" label="Lọc kết quả" aria-label="Filter" @click="applyFilters"/>
    </Fieldset>
  </div>
</template>

<style scoped>
</style>
