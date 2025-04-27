<script setup lang="ts">
import { ref, watch } from 'vue';
import Box from '~/components/atoms/Box.vue';
import Flex from '~/components/atoms/Flex.vue';
import { useGetListMovie } from '~/composables/api/movies/use-get-list-movie';

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'select', movie: Movie): void;
}>();

const localVisible = ref(props.visible);
watch(() => props.visible, val => localVisible.value = val);

const searchQuery = ref('');
const suggestions = ref<Movie[]>([]);
const params = ref({
  item: 10,
  keyword: '',
  page: 1
});

const localLoading = ref(false);
const { data, refetch } = useGetListMovie(params, true);

const search = async () => {
  const query = searchQuery.value.toLowerCase().trim();
  params.value.keyword = query;
  params.value.page = 1;
  suggestions.value = [];

  if (!query) return;
  await loadPage();
};

const loadPage = async () => {
  if (localLoading.value) return;
  localLoading.value = true;

  const delay = new Promise<void>(resolve => setTimeout(resolve, 500));
  const fetchPromise = refetch();
  await Promise.all([delay, fetchPromise]);

  const items = data.value?.data ?? [];
  const pageInfo = data.value?.paginate;

  suggestions.value.push(...items);
  localLoading.value = false;
};

const onScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  const pageInfo = data.value?.paginate;
  const totalPages = pageInfo?.totalPages ?? 1;

  if (
    target.scrollHeight - target.scrollTop <= target.clientHeight + 10 &&
    !localLoading.value &&
    params.value.page < totalPages
  ) {
    params.value.page += 1;
    loadPage();
  }
};

const handleSelect = (movie: Movie) => {
  emit('select', movie);
  emit('update:visible', false);
};
</script>

<template>
  <Box>
    <Dialog
      v-model:visible="localVisible"
      modal
      header="Chào mừng trở lại!"
      :style="{ minHeight: '280px', padding: '38px 70px 45px 70px', width: '580px' }"
      @hide="emit('update:visible', false)"
    >
      <template #container="{ closeCallback }">
        <Flex direction="column" gap="20px" :style="{ position: 'relative!important' }">
          <Box :style="{ position: 'absolute!important' }">
            <Button icon="pi pi-angle-left" variant="text" rounded aria-label="Cancel" @click="closeCallback" />
          </Box>

          <Flex direction="column" gap="10px" align="center">
            <img src="https://streamvid.jwsuperthemes.com/wp-content/uploads/2023/02/logo_sin.svg" alt="Logo" :style="{ width: '40px', height: '40px', objectFit: 'cover' }" />
            <h5 :style="{ color: '#00031C', fontSize: '21px', fontWeight: '700', margin: '0', textAlign: 'center' }">
              Chọn phim để thưởng thức cùng bạn bè nào!!
            </h5>
          </Flex>

          <Flex :style="{ width: '100%' }">
            <Flex direction="column" gap="12px" :style="{ width: '100%' }">
              <InputGroup>
                <InputText
                  placeholder="Keyword"
                  v-model="searchQuery"
                  @keyup.enter="search"
                />
                <InputGroupAddon>
                  <Button icon="pi pi-search" severity="secondary" variant="text" @click="search" />
                </InputGroupAddon>
              </InputGroup>
              <Button type="submit" severity="secondary" label="Tìm kiếm" @click="search" />
            </Flex>
          </Flex>

          <Flex v-if="!localLoading && suggestions.length === 0" justify="center">
            <h3>Chưa có kết quả</h3>
          </Flex>

          <ProgressSpinner
            v-else-if="localLoading && suggestions.length === 0"
            style="width: 50px; height: 50px"
            strokeWidth="8"
            fill="transparent"
            animationDuration=".5s"
            aria-label="Loading"
          />

          <ScrollPanel
            v-else
            :style="{ width: '100%', overflow: 'auto', minHeight: '65px', maxHeight: '235px' }"
            @scroll.native="onScroll"
          >
            <Flex
              v-for="movie in suggestions"
              :key="movie.id"
              @click="handleSelect(movie)"
              :style="{ margin: '12px 0' }"
              gap="12px"
              class="item-movie"
            >
              <NuxtImg
                :src="movie.thumbnail"
                alt="Thumbnail"
                :style="{ width: '50px', objectFit: 'cover' }"
              />
              <Flex direction="column" gap="14px" justify="center" align="flex-start">
                <h4 :style="{ fontSize: '12px', margin: '0' }">{{ movie.title }}</h4>
                <Flex :style="{ fontSize: '12px', color: '#aaa' }">
                  {{ movie.year }} <Divider layout="vertical" />
                  {{ movie.lang }} <Divider layout="vertical" />
                  {{ String(movie.esp_total).replace('Tập', '').trim() }} Tập
                </Flex>
              </Flex>
            </Flex>

            <div v-if="localLoading && suggestions.length > 0" class="loading-more">
              <ProgressSpinner
                style="width: 30px; height: 30px"
                strokeWidth="6"
                fill="transparent"
                animationDuration=".5s"
              />
            </div>
          </ScrollPanel>
        </Flex>
      </template>
    </Dialog>
  </Box>
</template>

<style scoped>
.loading-more {
  display: flex;
  justify-content: center;
  padding: 12px 0;
}

.item-movie {
  /* smooth transition for hover effects */
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  padding: 6px;
  border-radius: 4px;
}

.item-movie:hover {
  cursor: pointer;
  background-color: #f1f5f9;
  transform: translateY(-5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>