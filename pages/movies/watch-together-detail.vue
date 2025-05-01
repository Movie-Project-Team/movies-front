<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import Box from '~/components/atoms/Box.vue';
import Flex from '~/components/atoms/Flex.vue';
import ChatBox from '~/components/molecules/ChatBox.vue';
import { useEcho } from '~/composables/echo/use-echo';
import { useGetMovie } from '~/composables/api/movies/use-get-movie';
import useResponsive from '~/composables/resize/use-responsive';
import Hls from 'hls.js';
import EpisodeList from '~/components/molecules/EpisodeList.vue';
import { useGetMovieById } from '~/composables/api/movies/use-get-by-id';
import { useGetListCredit } from '~/composables/api/movies/use-get-list-credit';
import CastCircleItem from '~/components/atoms/CastCircleItem.vue';
import Tag from '~/components/atoms/Tag.vue';

// Routing & Movie Data
const route = useRoute();
const { isMobile, isTablet, isLaptop, isDesktop } = useResponsive();
const slug = computed(() => Array.isArray(route.params.title) ? route.params.title[0] : route.params.title);
const { data: movieResp } = useGetMovie(slug);
const movie = computed(() => movieResp.value?.data ?? {} as any);

// Room & Presence
const roomCode = computed<string>(() => (route.query.room as string) || '');
const users = ref<Array<{ id: number; name: string; avatarUrl?: string }>>([]);
const echo = useEcho();
const hostId = ref<number>(0);
const playerRef = ref<any>(null);
const playerInstance = ref<any>(null);
  const isHost = computed(() => {
  return users.value.length > 0 && hostId.value === users.value[0]?.id;
});
const isSyncing = ref(false);

const hasInteracted = ref(false);
const needsInit = ref(false);
const isClient = typeof window !== 'undefined';

function handleInteraction() {
  hasInteracted.value = true;
  if (needsInit.value) {
    initClientPlayback();
  }
}

onMounted(() => {
  const channel = echo.join(`room.${roomCode.value}`);
  channel
    .here((members: any[]) => {
      users.value = members.map(m => ({ id: m.id, name: m.name, avatarUrl: m.avatar }));
      if (!hostId.value && members.length === 1) {
        hostId.value = members[0].id;
      }

      if (!isHost.value) {
        needsInit.value = true;

        // Nếu người dùng đã từng tương tác (ví dụ reload), khởi động lại phát video
        if (isClient && hasInteracted.value) {
          initClientPlayback();
        }
      }
    })
    .joining((member: any) => {
      users.value.push({ id: member.id, name: member.name, avatarUrl: member.avatar });
    })
    .leaving((member: any) => {
      users.value = users.value.filter(u => u.id !== member.id);
    })
    .listenForWhisper('video.sync', async ({ time, isPlaying }: any) => {
      const player = playerInstance.value;
      if (!player) return;

      isSyncing.value = true;

      try {
        if (player.media.readyState < HTMLMediaElement.HAVE_METADATA) {
          await new Promise((resolve) => {
            player.media.addEventListener('loadedmetadata', resolve, { once: true });
          });
        }

        if (Math.abs(player.currentTime - time) > 1) {
          player.currentTime = time;
        }

        if (isPlaying && player.paused) {
          await player.play();
        } else if (!isPlaying && !player.paused) {
          player.pause();
        }
      } catch (error) {
        console.error('Lỗi đồng bộ:', error);
      } finally {
        setTimeout(() => {
          isSyncing.value = false;
        }, 500);
      }
    });

    // Listen for user interaction (click)
    if (needsInit.value) {
      initClientPlayback();
    }

    if (isClient) {
      document.body.addEventListener('click', () => {
        hasInteracted.value = true;
        if (needsInit.value) {
          initClientPlayback();
        }
      });
    }
});

onBeforeUnmount(() => {
  echo.leave(`room.${roomCode.value}`);
  if (isClient) {
    document.body.removeEventListener('click', handleInteraction);
  }
});

function syncState({ time, isPlaying }: { time: number; isPlaying: boolean }) {
  if (!isHost.value || isSyncing.value) return;
  const channel = echo.join(`room.${roomCode.value}`);
  channel.whisper('video.sync', { time, isPlaying });
}

function handlePlayerReady(e: any) {
  const player = e.detail.plyr;
  playerInstance.value = player;

  if (!isHost.value && needsInit.value) {
    player.muted = true;
  }

  player.on('play', () => {
    if (!isSyncing.value && isHost.value) {
      syncState({ time: player.currentTime, isPlaying: true });
    }
  });

  player.on('pause', () => {
    if (!isSyncing.value && isHost.value) {
      syncState({ time: player.currentTime, isPlaying: false });
    }
  });

  player.on('seeked', () => {
    if (!isSyncing.value && isHost.value) {
      syncState({ time: player.currentTime, isPlaying: !player.paused });
    }
  });
}

// Tự động khởi tạo video
function initClientPlayback() {
  const player = playerInstance.value;
  if (!player || !hasInteracted.value) return;

  hasInteracted.value = true;
  needsInit.value = false;

  player.muted = true;
  player.play().then(() => {
    player.pause(); // just to unlock playback
  }).catch((e: any) => {
    console.warn('Playback unlock failed:', e);
  });
}

watch([() => users.value, () => hostId.value], async () => {
  await nextTick();
});

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

// episodes
const serverItems = computed(() => {
  if (movie.value?.episodes && movie.value.episodes.length > 0) {
    return movie.value.episodes ?? [];
  }
  return [];
});


// active item
const activeItem = ref<number | null>(0);
const setActive = (index: number) => {
  activeItem.value = index;
};

// handle tag and genres
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
// handle set index episode
const activeEpisode = ref<number | null>(
  route.query.ep ? Number(route.query.ep) : 1
);
watch(() => route.query.ep, (newEp) => {
  activeEpisode.value = newEp ? Number(newEp) : 1;
});

// handle video
const videoPlayer = ref<any>(null);

const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/\s+/g, "-");
};

const srcVideo = computed(() => {
  const servers = movie.value?.episodes;
  if (!servers || servers.length === 0) return null;

  const serverSlug = computed(() => {
    const rawSlug = route.query.server;
    return rawSlug ? decodeURIComponent(String(rawSlug)) : '';
  });

  const serverData = computed(() => {
    return movie.value?.episodes?.find((server: any) => toSlug(server.server_name) === serverSlug.value) || null;
  });
  
  if (movie.value.esp_total == 1 && serverData) { 
    return serverData.value?.server_data[0].link_download || null;
  } else {
    const episode = serverData.value?.server_data.find((ep: any) => ep.name === String(activeEpisode.value));
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
    :style="{ padding: (!isMobile && !isTablet) ? '150px 70px' : '50px 0' }"
  >
    <h2 v-if="!isMobile && !isTablet">Phòng: {{ movie.title }}</h2>

    <Flex gap="12px" wrap="wrap" :style="{ margin: '24px 0px' }">
      <Flex v-for="user in users" :key="user.id" direction="column" gap="8px" align="center">
        <Avatar v-if="user.avatarUrl" :image="user.avatarUrl" size="xlarge" shape="circle" />
        <div v-else class="avatar-placeholder">
          {{ user.name.charAt(0).toUpperCase() }}
        </div>
        <span class="username">{{ user.name }}</span>
      </Flex>
    </Flex>
    <Flex>
      <Box v-if="users.length > 0" :class="{ 'is-host': isHost }" :style="{ width: '100%', marginBottom: '12px' }">
        <vue-plyr ref="playerRef" @ready="handlePlayerReady" :poster="movie.poster" :style="{ width: '100%', height: '100%', position: 'absolute' }">
          <video :muted="!isHost" :data-in-room="!!roomCode" ref="videoPlayer" src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4" data-poster="https://example.com/poster.jpg" controls playsinline width="100%">
            <p>Your browser does not support HTML5 video.</p>
          </video>
        </vue-plyr>
      </Box>
      <ChatBox v-if="roomCode" :room="roomCode" />
    </Flex>
    <Flex :style="{ width: '100%' }" :direction="isDesktop ? 'row' : 'column'">
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
              <Button label="Yêu thích" icon="pi pi-heart-fill" :style="{ backgroundColor: '#dc2626', border: 'none' }" />
            </Flex>
          </Flex>
        </Flex>
        <Divider v-show="!isMobile && !isTablet"/>
        <Box :style="{ width: '100%' }">
          <!-- Episode -->
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
      </Flex>
      <Box :style="{ width: (isDesktop || isLaptop) ? 'auto' : '100%', maxWidth: isDesktop ? '440px' : 'none', padding: isDesktop ? '1rem 2.5rem' : '1rem .5rem' }">
        <Box :style="{ width: '100%' }">
          <h2 :style="{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem!important' }">Diễn viên</h2>
          <Flex wrap="wrap" v-show="castList.length > 0">
            <CastCircleItem v-for="(item, index) in castList" :key="index" :data="item"/>
          </Flex>
          <p v-show="castList.length === 0" :style="{ color: '#6B7280' }">Chưa có thông tin</p>
        </Box>
      </Box>
    </Flex>
  </Box>
</template>

<style>
.avatar-placeholder {
  width: 48px;
  height: 48px;
  background-color: #aaa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.username {
  font-weight: 600;
}

.click-to-init {
  cursor: pointer;
}

:not(.is-host) .plyr--stopped .plyr__controls {
  display: none !important;
  pointer-events: none !important;
}
.is-host .plyr--stopped .plyr__controls {
  display: flex !important;
  pointer-events: auto !important;
}

:not(.is-host) .plyr--stopped .plyr__control--overlaid {
  display: none !important;
  pointer-events: none !important;
}

.is-host .plyr--stopped .plyr__control--overlaid {
  display: block !important;
  pointer-events: auto !important;
}

.plyr__controls {
  transition: opacity 0.3s ease;
}
</style>
