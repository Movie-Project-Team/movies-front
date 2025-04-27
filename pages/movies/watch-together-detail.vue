<script setup lang="ts">
import { ref, reactive, computed, watch, watchEffect, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Box from '~/components/atoms/Box.vue';
import Flex from '~/components/atoms/Flex.vue';
import EpisodeList from '~/components/molecules/EpisodeList.vue';
import ChatBox from '~/components/molecules/ChatBox.vue';

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
const users = ref<Array<{ id: number; name: string; isMicOn?: boolean }>>([]);
const localStream = ref<MediaStream | null>(null);
const peerConnections = reactive<Record<number, RTCPeerConnection>>({});
const remoteStreams = reactive<Record<number, MediaStream>>({});
const myMicOn = ref(false);

// ICE servers
const rtcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

// Thêm state để theo dõi hoạt động âm thanh
const activeSpeakers = reactive<Record<number, boolean>>({});
watch(activeSpeakers, (newSpeakers) => {
  console.log('Active Speakers:', newSpeakers);
});

// Thêm hàm phân tích âm thanh
function setupAudioAnalyser(stream: MediaStream, userId: number) {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const microphone = audioContext.createMediaStreamSource(stream);
  microphone.connect(analyser);
  analyser.fftSize = 256;
  
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  function checkAudio() {
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;
    console.log(`User ${userId} - Audio Level:`, average); 
    activeSpeakers[userId] = average > 10; // Ngưỡng âm thanh
    requestAnimationFrame(checkAudio);
  }
  checkAudio();
}

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
    pc.ontrack = e => {
      remoteStreams[from] = e.streams[0];
      setupAudioAnalyser(e.streams[0], from); // Thêm phân tích âm thanh
    };
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
      if (myMicOn.value) createAndSendOffer(member.id);
    })
    .leaving((member: any) => {
      users.value = users.value.filter(u => u.id !== member.id);
      peerConnections[member.id]?.close(); delete peerConnections[member.id]; delete remoteStreams[member.id];
    })
    .listenForWhisper('webrtc.signal', handleSignal)
    .listenForWhisper('mic-state', (data: any) => {
      const u = users.value.find(x => x.id === data.userId);
      if (u) u.isMicOn = data.state;
    });
});

onBeforeUnmount(() => {
  echo.leave(`room.${roomCode.value}`);
  localStream.value?.getTracks().forEach(t => t.stop());
  Object.values(peerConnections).forEach(pc => pc.close());
  if (users.value.length <= 1) closeRoom({ roomCode: roomCode.value });
});

// Microphone toggle
async function toggleMic() {
  myMicOn.value = !myMicOn.value;
  console.log('Microphone is now', myMicOn.value ? 'ON' : 'OFF');
  channel.whisper('mic-state', { userId: userId.value, state: myMicOn.value });
  if (myMicOn.value) {
    try {
      localStream.value = await navigator.mediaDevices.getUserMedia({ audio: true });
      users.value.filter(u => u.id !== userId.value).forEach(u => createAndSendOffer(u.id));
    } catch (err) {
      console.error('Error accessing microphone: ', err);
    }
  } else {
    localStream.value?.getTracks().forEach(t => t.stop());
    localStream.value = null;
    Object.values(peerConnections).forEach(pc => pc.close()); 
    for (const k in peerConnections) delete peerConnections[+k];
    for (const k in remoteStreams) delete remoteStreams[+k];
  }
}
</script>

<template>
  <Box :style="{ padding: (!isMobile && !isTablet) ? '150px 70px' : '50px 0' }">
    <h2 v-if="!isMobile && !isTablet">Phòng: {{ movie.title }}</h2>
    <Flex gap="16px" wrap="wrap">
      <Flex v-for="user in users" :key="user.id" direction="column" align="center">
        <div 
          class="avatar-placeholder" 
          :class="{ 'speaking': activeSpeakers[user.id] }"
          :style="activeSpeakers[user.id] ? { boxShadow: '0 0 10px 5px rgba(0, 255, 0, 0.7)' } : {}"
        >
          {{ user.name.charAt(0).toUpperCase() }}
        </div>
        <Button v-if="user.id === userId" @click="toggleMic">{{ myMicOn ? 'Tắt Micro' : 'Bật Micro' }}</Button>
        <p>{{ user.name }}</p>
        <audio v-if="user.id !== userId && remoteStreams[user.id]" :ref="(el: any) => el && (el.srcObject = remoteStreams[user.id])" autoplay></audio>
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
  width: 100px; 
  height: 100px;
  background: #444; 
  color: #fff;
  display: flex; 
  justify-content: center; 
  align-items: center;
  font-size: 2rem; 
  border-radius: 50%;
  transition: box-shadow 0.3s ease;
}

.avatar-placeholder.speaking {
  animation: pulse 0.5s infinite alternate;
}

@keyframes pulse {
  from {
    box-shadow: 0 0 5px 2px rgba(0, 255, 0, 0.5);
  }
  to {
    box-shadow: 0 0 15px 7px rgba(0, 255, 0, 0.9);
  }
}
</style>