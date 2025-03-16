<script setup>
import { ref, computed } from 'vue';
import { useGetListGenres } from '~/composables/api/util/use-get-list-genres';
import { useGetListLanguage } from '~/composables/api/util/use-get-list-language';

const { data: languageResponse } = useGetListLanguage();
const { data: genresResponse } = useGetListGenres();
const router = useRouter();

const resetQuery = (type) => {
  router.replace({ path: '/tim-kiem', query: { [type]: null, page: 1 } });
};

const formatData = (response, type) => {
  const list = response.value?.data?.map(item => ({
    label: item.title,
    slug: item.slug,
    command: () => {
      router.push({ path: '/tim-kiem', query: { [type]: item.slug, page: 1 } });
    }
  })) || [];

  return list.length > 12
    ? [...list.slice(0, 12), { label: 'Xem thêm', command: () => resetQuery(type) }]
    : list;
};


const languageData = computed(() => formatData(languageResponse, 'lang'));
const genresData = computed(() => formatData(genresResponse, 'gen'));

const items = ref([
  {
    label: 'Trang chủ',
    command: () => {
      router.push('/');
    },
  },
  {
    label: 'Thể loại',
    items: genresData
  },
  {
    label: 'Quốc gia',
    items: languageData
  },
  {
    label: 'Tìm kiếm',
    command: () => {
      router.push({ path: '/tim-kiem', query: { page: 1 } });
    },
  },
  {
    label: 'Phim sắp chiếu',
    command: () => {
      router.push('/sap-chieu');
    },
  },
  {
    label: 'Diễn viên',
  },
  {
    label: 'Tin tức',
  }
]);
</script>

<template>
  <div class="card">
    <Menubar 
      :model="items"
      :style="{
        background: 'none',
        border: 'none',
        color: '#fff',
      }" 
    >
      <template #item="{ item, props, hasSubmenu }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :style="{ color: '#ffffff' }">{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
          <span :style="{ color: '#ffffff' }">{{ item.label }}</span>
          <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" :style="{ color: '#ffffff' }"/>
        </a>
      </template>
    </Menubar>
  </div>
</template>
