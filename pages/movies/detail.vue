<script setup lang="ts">
import Box from '~/components/atoms/Box.vue';
import Flex from '~/components/atoms/Flex.vue';
import Tag from '~/components/atoms/Tag.vue';
import DetailInfoTab from '~/components/molecules/DetailInfoTab.vue';
import { useGetMovie } from '~/composables/api/movies/use-get-movie';

const route = useRoute();
const router = useRouter();
const loading = useLoadingStore();

const slug = computed(() => 
  Array.isArray(route.params.title) ? route.params.title[0] : route.params.title
);
const { data, isLoading: isLoadingDetailMovie } = useGetMovie(slug);
const movie = computed<Movie>(() => data.value?.data ?? ({} as Movie));

watchEffect(() => {
  if (isLoadingDetailMovie.value || !data.value) {
    loading.show();
  } else {
    loading.hide();
  }
});

const plainDescription = computed(() => {
  return (movie.value.description || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
});

const tagItems = computed(() => [
  { content: movie.value.vote_average ?? "N/A", subContent: "IMBd", type: "imdb" },
  { content: "T12", type: "background" },
  { content: movie.value.year ?? "N/A" },
  { 
    content: movie.value.season 
      ? `Phần ${movie.value.season}` 
      : "Chưa cập nhật" 
  },
  { 
    content: movie.value.esp_total 
      ? movie.value.esp_total.toString().includes("Tập") 
        ? movie.value.esp_total 
        : `Tập ${movie.value.esp_total}` 
      : "Chưa cập nhật" 
  }
]);

const posterSrc = computed(() => movie.value.poster || 'https://m.economictimes.com/thumb/msid-104359417,width-1200,height-900,resizemode-4,imgsize-54656/cinema-halls1.jpg')

const genreItems = [
  { content: "Hành Động", type: "topic" },
  { content: "Viễn Tưởng", type: "topic" },
  { content: "Phiêu Lưu", type: "topic" },
  { content: "Khoa Học", type: "topic" }
];

const goToDetail = (slug: any) => {
  router.push({ 
    path: `/xem-phim/${slug}`, 
    query: { server: 'vietsub', page: 1 } 
  });
};
</script>

<template>
  <Box
    :style="{
      padding: '150px 70px 100px'
    }"
  >
    <Flex gap="60px">
      <Flex
        direction="column"
        gap="10px"
        :style="{
          width: '40%',
          height: '200px',
        }"
      >
        <h1
          :style="{
            color: '#ffffff',
            margin: '10px 0px!important'
          }"
        >
          {{ movie?.title ?? 'Chưa có tiêu đề' }}
        </h1>
        <Flex
          gap="10px"
          :style="{
            height: '26px'
          }"
        >
          <Tag
            v-for="(tag, index) in tagItems"
            :key="index"
            :content="tag.content"
            :sub-content="tag.subContent"
            :type="tag.type"
          />
        </Flex>
        <Flex
          gap="10px"
          :style="{
            height: '26px'
          }"
        >
          <Tag
            v-for="(genre, index) in genreItems"
            :key="index"
            :content="genre.content"
            :type="genre.type"
          />
        </Flex>
        <Flex direction="column" gap="10px">
          <p :style="{ margin: '4px 0px!important' }">
            <span :style="{ fontWeight: '700' }">Đạo diễn: </span>
            {{ movie.produce_by ?? "Chưa cập nhật" }}
          </p>
          <p :style="{ margin: '4px 0px!important' }">
            <span :style="{ fontWeight: '700' }">Diễn viên: </span>
            Taito Ban, Genta Nakamura, Haruna Mikawa
          </p>
        </Flex>
        <Box>
          <p :style="{ margin: '4px 0px!important', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '4', overflow: 'hidden' }">
            <span :style="{ fontWeight: '700' }">Giới thiệu: </span>
            {{ plainDescription }}
          </p>
        </Box>
        <Flex :style="{ marginTop: '20px' }" gap="10px">
          <Button label="Xem phim" icon="pi pi-play" @click="goToDetail(movie.slug)"/>
          <Button label="Yêu thích" icon="pi pi-heart" :style="{ background: 'rgb(45, 47, 52)', border: 'none' }" />
          <Button label="Xem sau" icon="pi pi-bookmark" :style="{ background: 'rgb(45, 47, 52)', border: 'none' }"  />
        </Flex>
      </Flex>
      <Flex
        justify="center"
        :style="{
          position: 'relative',
          width: '60%',
        }"
      >
        <Box 
          :style="{
            position: 'absolute',
            width: '28%',
            height: '550px',
            left: '-35px',
            bottom: '45px',
            background: 'linear-gradient(270deg, rgba(25, 27, 36, 0) 0%, rgba(25, 27, 36, 0.2) 12%, rgba(25, 27, 36, 0.5) 25%, rgba(25, 27, 36, 0.7) 40%, rgba(25, 27, 36, 0.85) 55%, rgba(25, 27, 36, 0.95) 70%, rgb(25, 27, 36) 85%)'
          }"
        />
        <Box 
          :style="{
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: '4px',
            bottom: '40px',
            background: 'linear-gradient(179deg, rgba(25, 27, 36, 0) 1%, rgba(25, 27, 36, 0.2) 10%, rgba(25, 27, 36, 0.5) 40%, rgba(25, 27, 36, 0.7) 50%, rgba(25, 27, 36, 0.85) 65%, rgba(25, 27, 36, 0.95) 80%, rgb(25, 27, 36) 100%)'
          }"
        />
        <!-- Box góc trên bên phải -->
        <Box
          :style="{
            position: 'absolute',
            width: '16%',
            height: '100%',
            right: '0',
            top: '0',
            background: 'linear-gradient(90deg, rgba(25, 27, 36, 0) 0%, rgba(25, 27, 36, 0.4) 20%, rgba(25, 27, 36, 0.7) 50%, rgba(25, 27, 36, 0.9) 80%, rgb(25, 27, 36) 100%)'
          }"
        />
        <!-- Box phía trên -->
        <Box
          :style="{
            position: 'absolute',
            width: '100%',
            height: '100px',
            top: '0',
            background: 'linear-gradient(180deg, rgb(25, 27, 36) 0%, rgba(25, 27, 36, 0.6) 60%, rgba(25, 27, 36, 0) 100%)'
          }"
        />
        <Box
          :style="{
            width: '100%',
          }"
        >
          <NuxtImg fit="cover" :src="posterSrc" alt="" :style="{ width: '100%', height: '90%', maxHeight: '480px', objectFit: 'cover' }" />
        </Box>
      </Flex>
    </Flex>
    <DetailInfoTab :esp-current="movie?.esp_current" :slug="movie?.slug"/>
  </Box>
</template>

<style scoped>
</style>
