<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import Box from '~/components/atoms/Box.vue';
import Flex from '~/components/atoms/Flex.vue';
import ChatBox from '~/components/molecules/ChatBox.vue';
import { useEcho } from '~/composables/echo/use-echo';
import { useGetMovie } from '~/composables/api/movies/use-get-movie';
import useResponsive from '~/composables/resize/use-responsive';

// Routing & Movie Data
const route = useRoute();
const { isMobile, isTablet } = useResponsive();
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
    <div v-if="users.length > 0" :class="{ 'is-host': isHost }">
      <vue-plyr
        ref="playerRef"
        @ready="handlePlayerReady"
        :poster="movie.poster"
      >
        <video
          :src="`https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4`"
          playsinline
          :muted="!isHost"
          :data-in-room="!!roomCode"
          width="100%"
        ></video>
      </vue-plyr>
    </div>

    <ChatBox v-if="roomCode" :room="roomCode" />
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
