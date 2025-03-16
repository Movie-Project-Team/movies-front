<script setup lang="ts">
import Box from '~/components/atoms/Box.vue';
import CastCircleItem from '~/components/atoms/CastCircleItem.vue';
import CommentBox from '~/components/atoms/CommentBox.vue';
import CommentInput from '@/components/atoms/CommentInput.vue';
import Flex from '~/components/atoms/Flex.vue';
import Tag from '~/components/atoms/Tag.vue';
import EpisodeList from '~/components/molecules/EpisodeList.vue';
import { useComment } from '~/composables/api/movies/use-create-comment';
import { useGetComment } from '~/composables/api/movies/use-get-comment';
import { useGetListCredit } from '~/composables/api/movies/use-get-list-credit';
import { MovieService } from '~/services/DummnyDataMovie';
import { useGetMovie } from '~/composables/api/movies/use-get-movie';

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
        : `${movie.value.esp_total} Tập ` 
      : "Chưa cập nhật" 
  }
]);

const genreItems = [
  { content: "Hành Động", type: "topic" },
  { content: "Viễn Tưởng", type: "topic" },
  { content: "Phiêu Lưu", type: "topic" },
  { content: "Khoa Học", type: "topic" }
];

const serverItems = [
  { content: "Vietsub" },
  { content: "Thuyết minh" },
];

const loading = useLoadingStore();
const route = useRoute();
const slug = computed(() => 
  Array.isArray(route.params.title) ? route.params.title[0] : route.params.title
);

// fetch detail movie
const { data, isLoading: isLoadingDetailMovie } = useGetMovie(slug);
const movie = computed<Movie>(() => data.value?.data ?? ({} as Movie));

const movieId = computed(() => {
  return movie?.value?.id?.toString() || "";
});

const plainDescription = computed(() => {
  return (movie.value.description || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
});

watchEffect(() => {
  isLoadingDetailMovie.value ? loading.show() : loading.hide();
});

// fetch comment
const { data: commentList, refetch: refetchComment, isLoading: isLoadingComment } = useGetComment(movieId);
const commentsList = computed(() => commentList.value?.data ?? []);
const totalComments = ref(0);

watch(movieId, (newMovieId) => {
  if (newMovieId) {
    refetchComment();
  }
});

const countComments = (comments: any[]): number => 
  comments.reduce((total, comment) => total + 1 + countComments(comment.replies || []), 0);
  
const updateTotalComments = () => {
  totalComments.value = countComments(commentList.value?.data || []);
};

watch(() => commentList.value?.data, updateTotalComments, { deep: true, immediate: true })

// handle comment
const { mutate } = useComment();
const profile = useProfileStore();
const isRefetchComments = async () => {
  await refetchComment();
  updateTotalComments();
};

const submitComment = (comment: string) => {
  mutate(
    {
      movieId: Number(movieId.value),
      userId: Number(profile.user?.user_id),
      isApproved: 1,
      content: comment,
    },
    {
      onSuccess: async () => {
        await refetchComment();
        updateTotalComments();
      },
      onError: (error: any) => {
        console.error("Lỗi gửi bình luận:", error);
      },
    }
  );
};

const suggestMovie = MovieService.getMovieData();

// fetch redits
const type = ref("movie");
const tmdb = ref("tt28607951");
const { data: credits } = useGetListCredit(type, tmdb);
const castList = computed(() => credits.value?.cast?.slice(0, 5) ?? []);

// active item
const activeItem = ref<number | null>(0);
const setActive = (index: number) => {
  activeItem.value = index;
};

// handle set index episode
const activeEpisode = ref<number | null>(
  route.query.ep ? Number(route.query.ep) : null
);
watch(() => route.query.ep, (newEp) => {
  activeEpisode.value = newEp ? Number(newEp) : null;
});
</script>

<template>
  <Box
    :style="{
      padding: '150px 70px 60px'
    }"
  >
  <h2 :style="{ fontSize: '1.25rem', fontWeight: '500' }">
    Bạn đang xem phim: Avengers: {{ movie.title }}
  </h2>
  <Box :style="{ width: '100%', height: '900px', position: 'relative', margin: '1rem 0' }">
    <vue-plyr :style="{ width: '100%', height: '100%', position: 'absolute' }">
      <video ref="videoPlayer" src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4" data-poster="https://example.com/poster.jpg" controls playsinline width="100%">
        <p>Your browser does not support HTML5 video.</p>
      </video>
    </vue-plyr>
  </Box>
  <Flex :style="{ width: '100%' }" justify="center">
    <Flex
      direction="column"
      gap="24px"
      :style="{ 
        width: '1200px', 
        maxWidth: '1200px',
        padding: '10px',
        borderRight: '1px solid #272932' 
      }"
    >
      <Flex
        gap="12px"
        :style="{ width: '100%', paddingBottom: '8px' }"
      >
        <!-- Img box -->
        <Box 
          :style="{ 
            width: '100px', 
            minWidth: '100px',
            position: 'relative', 
            borderRadius: '0.25rem', 
            overflow: 'hidden' 
          }">
          <NuxtImg
            :src="movie.thumbnail" 
            preload 
            format="webp"
            :width="360"
            :height="425" 
            draggable="false" 
            loading="lazy"
            :style="{ position: 'absolute', transition: 'transform 0.3s', transform: 'scale(1)', height: '100%', width: '100%', objectFit: 'cover' }"
            @mouseover="$event.target.style.transform = 'scale(1.05)'"
            @mouseleave="$event.target.style.transform = 'scale(1)'"
          />
        </Box>
        <!-- Info movie box -->
        <Flex
          direction="column"
          :style="{ 
            width: '600px', 
            minWidth: '600px',
            position: 'relative',
            overflow: 'hidden'
          }">
            <h2 :style="{ fontSize: '1.25rem', fontWeight: 'bold' }">
              {{ movie.title }}
            </h2>
            <p :style="{ color: '#6b7280', fontSize: '0.875rem' }">
              {{ movie.name || "Chưa cập nhật" }}
            </p>
            <Flex direction="column" gap="0.5rem" :style="{ fontWeight: 'bold', fontSize: '12px' }">
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
            </Flex>
        </Flex>
        <!-- Description box -->
        <Flex
          direction="column"
          justify="space-between"
          :style="{
            width: '532px',
            maxWidth: '532px'
          }"
        >
          <p :style="{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '3', overflow: 'hidden', fontWeight: 'normal' }">
            {{ plainDescription }}
          </p>
          <Flex gap="12px">
            <Button label="Xem cùng nhau" icon="pi pi-users" />
            <Button label="Yêu thích" icon="pi pi-heart-fill" :style="{ backgroundColor: '#dc2626', border: 'none' }" />
          </Flex>
        </Flex>
      </Flex>
      <Divider/>
      <Box :style="{ width: '100%' }">
        <Flex align="center" :style="{ marginBottom: '1.5rem!important' }" gap="16px">
          <Flex align="center" justify="center" gap="8px">
            <i class="pi pi-bars" style="padding-top: 4px"/>
            <h2 :style="{ fontSize: '1.25rem', fontWeight: 'bold' }">Danh sách tập</h2>
          </Flex>
          <Divider layout="vertical"/>
          <Flex gap="20px">
            <Flex
              v-for="(item, index) in serverItems"
              :key="index"
              align="center"
              gap="10px"
              @click="setActive(index)"
              :style="{
                border: activeItem === index ? '1px solid yellow' : 'none',
                padding: '8px',
                fontSize: '12px',
                borderRadius: '6px',
                color: activeItem === index ? 'yellow' : '#fff',
                opacity: activeItem === index ? '1' : '.8',
                cursor: 'pointer'
              }"
            >
              <i class="pi pi-server" :style="{ color: activeItem === index ? 'yellow' : '#fff' }" />
              {{ item.content }}
            </Flex>
          </Flex>
        </Flex>
        <ScrollPanel :style="{ width: '100%', overflow: 'auto', minHeight: '65px', maxHeight: '235px' }">
          <EpisodeList 
            :esp-current="movie?.esp_current" 
            :slug="movie?.slug" 
            :activeEpisode="activeEpisode"
          />
        </ScrollPanel>
      </Box>
      <Box>
        <Flex direction="column" :style="{ marginBottom: '1.5rem!important' }" gap="24px">
          <Flex align="center" gap="8px">
            <i class="pi pi-comments" />
            <h2 :style="{ fontSize: '1.25rem', fontWeight: 'bold' }">Bình luận ({{ totalComments }})</h2>
          </Flex>
          <div class="comment-wrapper">
            <CommentInput @submitComment="submitComment" />
            <div v-if="!profile.user" class="comment-overlay">
              <p>Đăng nhập để bình luận</p>
            </div>
          </div>
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent"
            v-if="isLoadingComment" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
          <Flex v-else direction="column" gap="24px">
            <CommentBox 
              v-for="comment in commentsList" 
              :key="comment.id"
              :id="comment.id"
              :name="comment.user.name"
              :time="comment.created_at" 
              :comment="comment.content" 
              :replies="comment.replies"
              @update:isRefetch="isRefetchComments()"
            />
            <h3 v-if="totalComments == 0">Chưa có bình luận, hãy bình luận nào!!!</h3>
          </Flex>
        </Flex>
      </Box>
    </Flex>
    <Box :style="{ width: '440px', maxWidth: '440px', padding: '1rem 2.5rem' }">
      <Box :style="{ width: '100%' }">
        <h2 :style="{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem!important' }">Diễn viên</h2>
        <Flex wrap="wrap">
          <CastCircleItem v-for="(item, index) in castList" :key="index" :data="item"/>
        </Flex>
      </Box>
      <Box :style="{ width: '100%' }">
        <h2 :style="{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem!important' }">Đề xuất</h2>
        <NuxtLink v-for="(item, index) in suggestMovie" :key="index" :to="`/phim/${item.slug}`" style="text-decoration: none; color: inherit;">
          <Flex gap="20px" :style="{ backgroundColor: '#272932', padding: '10px', borderRadius: '8px', marginBottom: '10px' }">
            <NuxtImg
              :src="item.poster"
              alt="icon"
              :style="{
                width: '80px',
                height: '100%',
                objectFit: 'cover',
              }"
            />
            <Flex
              direction="column"
              gap="10px"
              justify="center"
              align="flex-start"
            >
              <h4 :style="{ fontSize: '12px', margin: '0px' }">
                {{ item.title }}
              </h4>
              <h4 :style="{ fontSize: '12px', margin: '0px' }">
                {{ item.original_title }}
              </h4>
              <Flex :style="{ fontSize: '12px', color: '#aaa' }">
                {{ item.releaseYear }} 
                <Divider layout="vertical" />
                {{ item.model }}
                <Divider layout="vertical" />
                {{ item.totalEpisodes }} Tập
              </Flex>
              <span :style="{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '2', overflow: 'hidden', fontWeight: 'normal', fontSize: '12px', color: '#aaa' }">
                {{ item.description }}
              </span>
            </Flex>
          </Flex>
        </NuxtLink>
      </Box>
    </Box>
  </Flex>
  </Box>
</template>

<style scoped>
.comment-wrapper {
  position: relative;
}

.comment-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
}
</style>
