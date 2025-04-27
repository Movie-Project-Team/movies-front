<script setup lang="ts">
import { ref, reactive, computed, watch, watchEffect, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Box from '~/components/atoms/Box.vue';
import Flex from '~/components/atoms/Flex.vue';
import EpisodeList from '~/components/molecules/EpisodeList.vue';
import ChatBox from '~/components/molecules/ChatBox.vue';
import Camera from '~/components/molecules/Camera.vue';

import { useProfileStore } from '~/stores/profile';
import useResponsive from '~/composables/resize/use-responsive';
import { useEcho } from '~/composables/echo/use-echo';
import { useCloseRoom } from '~/composables/api/room/use-close-room';
import { useGetHistory } from '~/composables/api/movies/use-get-history';
import { useSaveHistory } from '~/composables/api/movies/use-save-history';
import { useGetMovie } from '~/composables/api/movies/use-get-movie';
import { useGetMovieById } from '~/composables/api/movies/use-get-by-id';
import { useGetListCredit } from '~/composables/api/movies/use-get-list-credit';

// --- Routing & Profile ---
const route = useRoute();
const router = useRouter();
const profileStore = useProfileStore();
const userId = computed<number>(() => Number(profileStore.user?.id ?? 0));

// --- Active Episode (ensure number type) ---
const activeEpisode = computed<number>(() => {
  const ep = route.query.ep;
  if (Array.isArray(ep)) return Number(ep[0]) || 1;
  return Number(ep) || 1;
});

// --- Responsive ---
const { isMobile, isTablet, isLaptop, isDesktop } = useResponsive();

// --- Movie Data & History ---
const slug = computed(() => Array.isArray(route.params.title) ? route.params.title[0] : route.params.title);
const { data: movieResp, isLoading: loadingMovie } = useGetMovie(slug);
const movie = computed(() => movieResp.value?.data ?? {} as any);
const movieId = computed<number>(() => movie.value.id ?? 0);

const { data: historyResp } = useGetHistory(userId, movieId);
const { mutate: saveHistory } = useSaveHistory();

// Update history on pause
function onPause(time: number) {
  if (!userId.value) return;
  saveHistory({
    profileId: userId.value,
    movieId: movieId.value,
    timeProcess: time,
    episode: activeEpisode.value,
    lastWatchedAt: new Date().toISOString()
  });
}

// Seek to saved time
function restoreTime(player: any) {
  const saved = historyResp.value?.data?.timeProcess;
  if (!saved || !player) return;
  if (player.ready) player.currentTime = saved;
  else player.once('loadedmetadata', () => player.currentTime = saved);
}

// --- Credits ---
const type = computed(() => ['series','hoathinh','tvshows'].includes(movie.value.type) ? 'tv' : (movie.value.type === 'single' ? 'movie' : 'movie'));
const tmdbId = computed(() => movie.value.imdb || '');
const { data: tmdbResp } = useGetMovieById(tmdbId, type);
const resolvedId = computed<any>(() => type.value === 'tv' ? tmdbResp.value?.tv_results?.[0]?.id || tmdbId.value : tmdbId.value);
const { data: creditsResp } = useGetListCredit(type, resolvedId);
const castList = computed(() => creditsResp.value?.cast?.slice(0,6) || []);

// --- Room & Signaling ---
const roomCode = computed<string>(() => (route.query.room as string) || '');
const { mutate: closeRoom } = useCloseRoom();
const echo = useEcho();

// State
const users = ref<Array<{ id: number; name: string; isCameraOn?: boolean }>>([]);
const localStream = ref<MediaStream | null>(null);
const peerConnections = reactive<Record<number, RTCPeerConnection>>({});
const remoteStreams = reactive<Record<number, MediaStream>>({});
const myCameraOn = ref(false);

// ICE servers
const rtcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

// Helpers
function addTracks(pc: RTCPeerConnection) {
  localStream.value?.getTracks().forEach(track => pc.addTrack(track, localStream.value!));
}

async function createAndSendOffer(toId: number) {
  const pc = new RTCPeerConnection(rtcConfig);
  peerConnections[toId] = pc;
  addTracks(pc);

  pc.ontrack = e => remoteStreams[toId] = e.streams[0];
  pc.onicecandidate = e => e.candidate && channel.whisper('webrtc.signal', { from: userId.value, to: toId, candidate: e.candidate });

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  channel.whisper('webrtc.signal', { from: userId.value, to: toId, sdp: pc.localDescription });
}

async function handleSignal({ from, to, sdp, candidate }: any) {
  if (to !== userId.value) return;
  let pc = peerConnections[from];
  if (!pc) {
    pc = new RTCPeerConnection(rtcConfig);
    peerConnections[from] = pc;
    addTracks(pc);
    pc.ontrack = e => remoteStreams[from] = e.streams[0];
    pc.onicecandidate = e => e.candidate && channel.whisper('webrtc.signal', { from: userId.value, to: from, candidate: e.candidate });
  }
  if (sdp) {
    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    if (sdp.type === 'offer') {
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      channel.whisper('webrtc.signal', { from: userId.value, to: from, sdp: pc.localDescription });
    }
  }
  if (candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
}

let channel: any;
onMounted(() => {
  channel = echo.join(`room.${roomCode.value}`)
    .here((members: any[]) => users.value = members)
    .joining((member: any) => {
      users.value.push(member);
      if (myCameraOn.value) createAndSendOffer(member.id);
    })
    .leaving((member: any) => {
      users.value = users.value.filter(u => u.id !== member.id);
      peerConnections[member.id]?.close(); delete peerConnections[member.id]; delete remoteStreams[member.id];
    })
    .listenForWhisper('webrtc.signal', handleSignal)
    .listenForWhisper('camera-state', (data: any) => {
      const u = users.value.find(x => x.id === data.userId);
      if (u) u.isCameraOn = data.state;
    });
});

onBeforeUnmount(() => {
  echo.leave(`room.${roomCode.value}`);
  localStream.value?.getTracks().forEach(t => t.stop());
  Object.values(peerConnections).forEach(pc => pc.close());
  if (users.value.length <= 1) closeRoom({ roomCode: roomCode.value });
});

// Camera toggle
async function toggleCamera() {
  myCameraOn.value = !myCameraOn.value;
  channel.whisper('camera-state', { userId: userId.value, state: myCameraOn.value });
  if (myCameraOn.value) {
    localStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    users.value.filter(u => u.id !== userId.value).forEach(u => createAndSendOffer(u.id));
  } else {
    localStream.value?.getTracks().forEach(t => t.stop()); localStream.value = null;
    Object.values(peerConnections).forEach(pc => pc.close()); for (const k in peerConnections) delete peerConnections[+k];
    for (const k in remoteStreams) delete remoteStreams[+k];
  }
}
</script>


<template>
  <Box :style="{ padding: (!isMobile && !isTablet) ? '150px 70px' : '50px 0' }">
    <h2 v-if="!isMobile && !isTablet">Phòng: {{ movie.title }}</h2>
    <Flex gap="16px" wrap="wrap">
      <Flex v-for="user in users" :key="user.id" direction="column" align="center">
        <Camera v-if="user.id === userId" :isCameraOn="myCameraOn" />
        <video v-else-if="remoteStreams[user.id]" :ref="(el: any) => el && (el.srcObject = remoteStreams[user.id])" autoplay playsinline width="200" height="150"/>
        <div v-else class="avatar-placeholder">{{ user.name }}</div>
        <Button v-if="user.id === userId" @click="toggleCamera">{{ myCameraOn ? 'Tắt Camera' : 'Bật Camera' }}</Button>
        <p>{{ user.name }}</p>
      </Flex>
    </Flex>
    <Flex gap="8px" :direction="isDesktop ? 'row' : 'column'">
      <Box :style="{ width: '100%', height: isMobile ? '300px' : '600px' }">
        <vue-plyr @pause="(e: any) => onPause(e.detail.plyr.currentTime)" @ready="(e: any) => restoreTime(e.detail.plyr)" :poster="movie.poster">
          <video ref="videoPlayer" :src="movie.videoUrl" playsinline controls width="100%"></video>
        </vue-plyr>
      </Box>
      <ChatBox v-if="roomCode" :room="roomCode"/>
    </Flex>
  </Box>
</template>

<style scoped>
.avatar-placeholder {
  width: 200px; height: 150px;
  background: #444; color: #fff;
  display: flex; justify-content: center; align-items: center;
  font-size: 2rem; border-radius: 4px;
}
</style>