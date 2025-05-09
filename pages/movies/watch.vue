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
import { useGetMovie } from '~/composables/api/movies/use-get-movie';
import { useSaveHistory } from '~/composables/api/movies/use-save-history';
import { useGetHistory } from '~/composables/api/movies/use-get-history';
import { useGetMovieById } from '~/composables/api/movies/use-get-by-id';
import { useGetListRecommend } from '~/composables/api/movies/use-get-list-recommend';
import ChatBox from '~/components/molecules/ChatBox.vue';
import useResponsive from '~/composables/resize/use-responsive';
import Hls from 'hls.js';

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

const loading = useLoadingStore();
const route = useRoute();
const slug = computed(() => 
  Array.isArray(route.params.title) ? route.params.title[0] : route.params.title
);

// fetch detail movie
const { data, isLoading: isLoadingDetailMovie } = useGetMovie(slug);
const movie = computed<Movie>(() => data.value?.data ?? ({} as Movie));

const movieId = computed(() => {
  return movie?.value?.id || 0;
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
      profileId: Number(profile.user?.id),
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

// recommend movie
const { data: recommendMovie } = useGetListRecommend(movieId);

// active item
const activeItem = ref<number | null>(0);
const setActive = (index: number) => {
  activeItem.value = index;
};

// handle set index episode
const activeEpisode = ref<number | null>(
  route.query.ep ? Number(route.query.ep) : 1
);
watch(() => route.query.ep, (newEp) => {
  activeEpisode.value = newEp ? Number(newEp) : 1;
});

// handle video
const videoPlayer = ref<any>(null);
const profileId = computed(() => Number(profile.user?.id));
const { mutate: mutateHistory } = useSaveHistory();
const { data: detailHistory } = useGetHistory(profileId, movieId);

onMounted(async () => {
  if (!profile.user) return;
  await nextTick();

  if (!videoPlayer.value) {
    console.error("videoPlayer is null");
    return;
  }
  // Hàm đặt lại currentTime
  const updateCurrentTime = () => {
    if (!detailHistory.value?.data || !videoPlayer.value.plyr) return;
    const { timeProcess } = detailHistory.value.data;
    // Kiểm tra nếu plyr đã sẵn sàng thì set ngay, nếu chưa thì chờ sự kiện
    if (videoPlayer.value.plyr.ready) {
      videoPlayer.value.plyr.currentTime = timeProcess;
    } else {
      videoPlayer.value.plyr.once("loadedmetadata", () => {
        videoPlayer.value.plyr.currentTime = timeProcess;
      });
    }
  };
  // Lần đầu tiên chạy ngay khi component được mount
  updateCurrentTime();
  // Theo dõi sự thay đổi của detailHistory
  watch(() => detailHistory.value?.data, () => {
    updateCurrentTime();
  }, { immediate: true, deep: true });
  // Lắng nghe khi video được load lại
  videoPlayer.value.plyr.on("loadedmetadata", updateCurrentTime);
});

function handlePause() {
  if (!profile.user) return;
  mutateHistory({
    profileId: Number(profile.user?.id),
    movieId: Number(movieId.value),
    timeProcess: videoPlayer.value.plyr?.currentTime,
    episode: Number(activeEpisode.value),
    lastWatchedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
  })
}

// handle cast
const type = ref<string>("");
const tmdb = ref<string>("");

watch(() => [movie.value.type, movie.value.imdb], () => {
  type.value = ["series", "hoathinh", "tvshows"].includes(movie.value.type ?? "")
    ? "tv" : movie.value.type === "single" ? "movie" : "default";
  tmdb.value = movie.value.imdb ?? "113268";
}, { immediate: true });

const { data: tvTMDB } = useGetMovieById(tmdb, type);
const resolvedTmdb = computed(() => {
  if (type.value === "tv" && tvTMDB.value?.tv_results?.[0]?.id) {
    return String(tvTMDB.value.tv_results[0].id);
  }
  return movie.value.imdb ?? "113268";
});

const { data: credits } = useGetListCredit(type, resolvedTmdb);
const castList = computed(() => credits.value?.cast?.slice(0, 6) ?? []);

// chat
// Biến lưu tin nhắn mới
const router = useRouter();
const roomId = ref<any>(
  route.query.room ? route.query.room : null
);

watch(
  () => route.query.room,
  (newRoom) => {
    if (newRoom) {
      location.reload();
    }
  }
);

function watchTogether() {
  router.push({ 
    path: `/xem-phim/${movie.value.slug}`, 
    query: { room: 123 } 
  });
}

useHead(() => ({
  title: movie.value.title ? `Xem Phim - ${movie.value.title}` : 'Đang tải...',
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: movie.value.poster,
    },
    {
      rel: 'preload',
      as: 'image',
      href: movie.value.thumbnail,
    },
  ],
}));

// responsive
const { isMobile, isTablet, isLaptop, isDesktop } = useResponsive();

// episodes
const serverItems = computed(() => {
  if (movie.value?.episodes && movie.value.episodes.length > 0) {
    return movie.value.episodes ?? [];
  }
  return [];
});

const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/\s+/g, "-");
};

// src video
const srcVideo = computed(() => {
  const servers = movie.value?.episodes;
  if (!servers || servers.length === 0) return null;

  const serverSlug = computed(() => {
    const rawSlug = route.query.server;
    return rawSlug ? decodeURIComponent(String(rawSlug)) : '';
  });

  const serverData = computed(() => {
    return movie.value?.episodes?.find(server => toSlug(server.server_name) === serverSlug.value) || null;
  });
  
  if (movie.value.esp_total == 1 && serverData) { 
    return serverData.value?.server_data[0].link_download || null;
  } else {
    const episode = serverData.value?.server_data.find(ep => ep.name === String(activeEpisode.value));
    return episode?.link_download || null;
  }
});
watchEffect(() => {
  const source = srcVideo.value;
  
  if (Hls.isSupported() && source && videoPlayer.value) {
    const hls = new Hls();
    hls.loadSource(source);
    hls.attachMedia(videoPlayer.value);
  }
});

</script>

<template>
  <Box
    :style="{
      padding: (!isMobile && !isTablet) ? '150px 70px 100px' : '50px 0px'
    }"
  >
  <h2 :style="{ fontSize: '1.25rem', fontWeight: '500' }" v-show="!isMobile && !isTablet">
    Bạn đang xem phim: {{ movie.title }}
  </h2>
  <Flex gap="8px">  
    <Box :style="{ width: '100%', height: (!isMobile && !isTablet) ? '900px' : '400px', position: 'relative', margin: '1rem 0' }">
      <vue-plyr @pause="handlePause" :poster="movie.poster" :style="{ width: '100%', height: '100%', position: 'absolute' }">
        <video ref="videoPlayer" src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4" data-poster="https://example.com/poster.jpg" controls playsinline width="100%">
          <p>Your browser does not support HTML5 video.</p>
        </video>
      </vue-plyr>
    </Box>
    <ChatBox v-show="roomId"/>
  </Flex>
  <Flex :style="{ width: '100%' }" justify="center" :direction="isDesktop ? 'row' : 'column'">
    <Flex
      direction="column"
      gap="24px"
      :style="{ 
        width: (isDesktop || isLaptop) ? 'auto' : '100%', 
        maxWidth: '1200px',
        padding: '10px',
        borderRight: '1px solid #272932' 
      }"
    >
      <Flex
        gap="12px"
        :style="{ width: '100%', paddingBottom: '8px' }"
        v-show="isDesktop"
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
            {{ getPlainDescription(movie.description ?? '') }}
          </p>
          <Flex gap="12px">
            <Button label="Xem cùng nhau" icon="pi pi-users" @click="watchTogether"/>
            <Button label="Yêu thích" icon="pi pi-heart-fill" :style="{ backgroundColor: '#dc2626', border: 'none' }" />
          </Flex>
        </Flex>
      </Flex>
      <Divider v-show="!isMobile && !isTablet"/>
      <Box :style="{ width: '100%' }">
        <!-- <Flex :align="(isDesktop || isLaptop) ? 'center' : 'flex-start'" :style="{ marginBottom: '1.5rem!important' }" gap="16px" :direction="(isDesktop || isLaptop) ? 'row' : 'column'">
          <Flex align="center" justify="center" gap="8px">
            <i class="pi pi-bars" style="padding-top: 4px"/>
            <h2 :style="{ fontSize: '1.25rem', fontWeight: 'bold' }">Danh sách tập</h2>
          </Flex>
          <Divider layout="vertical" v-show="!isMobile && !isTablet"/>
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
              {{ item.server_name }}
            </Flex>
          </Flex>
        </Flex>
        <ScrollPanel :style="{ width: '100%', overflow: 'auto', minHeight: '65px', maxHeight: '235px' }">
          <EpisodeList
            :slug="movie?.slug" 
            :activeEpisode="activeEpisode"
            :esp-data="episodes"
          />
        </ScrollPanel> -->

        <!-- Test episode -->
        <Tabs value="1">
          <TabList>
            <Flex gap="20px" :align="(isDesktop || isLaptop) ? 'center' : 'flex-start'" :direction="(isDesktop || isLaptop) ? 'row' : 'column'">
              <Tab value="0">
                <Flex gap="16px">
                  <Flex align="center" justify="center" gap="8px">
                    <i class="pi pi-bars" style="padding-top: 4px"/>
                    <h2 :style="{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff' }">Danh sách tập</h2>
                  </Flex>
                  <Divider layout="vertical" :style="{ minHeight: 'none!important' }" v-show="!isMobile && !isTablet"/>
                </Flex>
              </Tab>
              <Tab :value="`${index + 1}`" v-for="(item, index) in serverItems">
                <Flex
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
                  {{ item.server_name }}
                </Flex>
              </Tab>
            </Flex>
          </TabList>
          <TabPanels>
            <TabPanel value="0"></TabPanel>
            <TabPanel :value="`${index + 1}`" v-for="(item, index) in serverItems">
              <ScrollPanel :style="{ width: '100%', overflow: 'auto', minHeight: '65px', maxHeight: '235px' }">
                <EpisodeList
                  :slug="movie?.slug" 
                  :activeEpisode="activeEpisode"
                  :esp-data="item.server_data ?? []"
                  :server="item.server_name"
                />
              </ScrollPanel>
            </TabPanel>
          </TabPanels>
        </Tabs>
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
            <h3 v-if="totalComments == 0" :style="{ fontSize: isDesktop || isLaptop ? '18px' : '14px' }">Chưa có bình luận, hãy bình luận nào!!!</h3>
          </Flex>
        </Flex>
      </Box>
    </Flex>
    <Box :style="{ width: (isDesktop || isLaptop) ? 'auto' : '100%', maxWidth: isDesktop ? '440px' : 'none', padding: isDesktop ? '1rem 2.5rem' : '1rem .5rem' }">
      <Box :style="{ width: '100%' }">
        <h2 :style="{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem!important' }">Diễn viên</h2>
        <Flex wrap="wrap" v-show="castList.length > 0">
          <CastCircleItem v-for="(item, index) in castList" :key="index" :data="item"/>
        </Flex>
        <p v-show="castList.length === 0" :style="{ color: '#6B7280' }">Chưa có thông tin</p>
      </Box>
      <Box :style="{ width: '100%' }">
        <h2 :style="{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem!important' }">Đề xuất</h2>
        <NuxtLink v-for="(item, index) in recommendMovie?.data" :key="index" :to="`/phim/${item.slug}`" style="text-decoration: none; color: inherit;">
          <Flex gap="20px" :style="{ backgroundColor: '#272932', padding: '10px', borderRadius: '8px', marginBottom: '10px', width: (!isMobile && !isTablet) ? 'auto' : 'calc(100vw - 30px)' }">
            <NuxtImg
              :src="item.thumbnail"
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
                {{ item.name }}
              </h4>
              <Flex :style="{ fontSize: '12px', color: '#aaa' }">
                {{ item.year }} 
                <Divider layout="vertical" />
                {{ item.lang }}
                <Divider layout="vertical" />
                {{ item.esp_total }} Tập
              </Flex>
              <span :style="{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '2', overflow: 'hidden', fontWeight: 'normal', fontSize: '12px', color: '#aaa' }">
                {{ getPlainDescription(item.description ?? '') }}
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

.zoom-enter-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}
.zoom-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.zoom-enter-from {
  transform: scale(0);
  opacity: 0;
}
.zoom-enter-to {
  transform: scale(1);
  opacity: 1;
}
.zoom-leave-from {
  transform: scale(1);
  opacity: 1;
}
.zoom-leave-to {
  transform: scale(0);
  opacity: 0;
}
</style>