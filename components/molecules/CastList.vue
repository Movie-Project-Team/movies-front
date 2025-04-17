<script setup lang="ts">
import { useGetListCredit } from '~/composables/api/movies/use-get-list-credit';
import CastItem from '../atoms/CastItem.vue';
import Flex from '../atoms/Flex.vue';
import { useGetMovieById } from '@/composables/api/movies/use-get-by-id';

const props = defineProps<{ type?: string, imdb?: string }>();

const type = ref<string>("");
const tmdb = ref<string>("");

watch(() => [props.type, props.imdb], () => {
  type.value = ["series", "hoathinh", "tvshows"].includes(props.type ?? "")
    ? "tv" : props.type === "single" ? "movie" : "default";
  tmdb.value = props.imdb ?? "113268";
}, { immediate: true });

const { data: tvTMDB } = useGetMovieById(tmdb, type);

const resolvedTmdb = computed(() => {
  if (type.value === "tv" && tvTMDB.value?.tv_results?.[0]?.id) {
    return String(tvTMDB.value.tv_results[0].id);
  }
  return props.imdb ?? "113268";
});


const { data: credits } = useGetListCredit(type, resolvedTmdb);
const castList = computed(() => credits.value?.cast?.slice(0, 12) ?? []);

</script>

<template>
  <Flex gap="14px" wrap="wrap" justify="flex-start" align="center">
    <Flex wrap="wrap" gap="16px" v-show="castList.length > 0">
      <CastItem v-for="(item, index) in castList" :data="item" :key="index" />
    </Flex>

    <!-- Hiển thị thông báo nếu không có dữ liệu -->
    <p v-show="castList.length === 0" :style="{ color: '#6B7280' }">Chưa có thông tin</p>
  </Flex>
</template>

<style scoped></style>
