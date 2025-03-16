<script setup lang="ts">
import { useGetListLanguage } from '~/composables/api/util/use-get-list-language';
import ActiveList from '../atoms/ActiveList.vue';
import { useGetListGenres } from '~/composables/api/util/use-get-list-genres';
import { nextTick, ref, watchEffect, computed } from 'vue';

const loading = useLoadingStore();
const router = useRouter();
const selectedFilters = ref<Record<string, string | null>>({
  lang: null,
  gen: null,
  year: null,
  rating: null,
  status: null,
  type: null,
});
const { data: languageResponse } = useGetListLanguage();
const { data: genresResponse } = useGetListGenres();

const formatData = (response: any) => {
  return ["Tất cả", ...(response?.value?.data?.map((item: any) => ({
    title: item.title,
    slug: item.slug
  })) || [])];
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
    items: ["Tất cả", "2024", "2023", "2022", "2021", "Trước 2020"],
  },
  {
    label: "Đánh giá",
    items: ["Tất cả", "⭐ 5 sao", "⭐ 4 sao", "⭐ 3 sao", "⭐ 2 sao", "⭐ 1 sao"],
  },
  {
    label: "Trạng thái phim",
    items: ["Tất cả", "Đang chiếu", "Sắp chiếu", "Hoàn thành"],
  },
  {
    label: "Loại phim",
    items: ["Tất cả", "Phim lẻ", "Phim bộ", "Phim chiếu rạp", "Phim hoạt hình"],
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
  router.push({
    path: "/tim-kiem",
    query: {
      ...selectedFilters.value,
      page: "1",
    },
  });
};

</script>

<template>
  <div class="card">
    <Fieldset legend="Bộ lọc" :toggleable="true">
      <div v-for="(data, index) in filterDataList" :key="index">
        <ActiveList :data="data" @update="setFilter(data.label, $event)" />
        <Divider style="--p-divider-border-color: #ffffff10"/>
      </div>   
      <Button :style="{ width: '200px', marginTop: '20px' }" icon="pi pi-arrow-right" label="Lọc kết quả" aria-label="Filter" @click="applyFilters"/>
    </Fieldset>
  </div>
</template>

<style scoped>
</style>
