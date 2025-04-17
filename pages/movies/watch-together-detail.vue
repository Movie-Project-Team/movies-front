<script setup lang="ts">
import Box from '~/components/atoms/Box.vue';
import CastCircleItem from '~/components/atoms/CastCircleItem.vue';
import Flex from '~/components/atoms/Flex.vue';
import Tag from '~/components/atoms/Tag.vue';
import EpisodeList from '~/components/molecules/EpisodeList.vue';
import { useGetListCredit } from '~/composables/api/movies/use-get-list-credit';
import { useGetMovie } from '~/composables/api/movies/use-get-movie';
import { useSaveHistory } from '~/composables/api/movies/use-save-history';
import { useGetHistory } from '~/composables/api/movies/use-get-history';
import { useGetMovieById } from '~/composables/api/movies/use-get-by-id';
import ChatBox from '~/components/molecules/ChatBox.vue';
import useResponsive from '~/composables/resize/use-responsive';
import { useEcho } from '~/composables/echo/use-echo';
import Camera from '~/components/molecules/Camera.vue';
import { useCloseRoom } from '~/composables/api/room/use-close-room';

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
  return movie?.value?.id || 0;
});

watchEffect(() => {
  isLoadingDetailMovie.value ? loading.show() : loading.hide();
});

// fetch comment
const profile = useProfileStore();

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

// webrtc and boashcating laravel
const users = ref<any[]>([])
const roomStatus = ref('active')
const myCameraOn = ref(false);
const localStream = ref<MediaStream | null>(null);

const isRoomEmpty = () => {
  return users.value.length <= 1
}

// Lưu các kết nối của user khác, key là userId
const peerConnections = reactive<Record<number, RTCPeerConnection>>({});
// Lưu remote streams của user khác, key là userId
const remoteStreams = reactive<Record<number, MediaStream>>({});
function setRemoteVideo(el: Element | ComponentPublicInstance | null, userId: number) {
  const videoEl = el as HTMLVideoElement | null
  if (videoEl && remoteStreams[userId]) {
    videoEl.srcObject = remoteStreams[userId]
  }
}

const echo = useEcho()
let channel: any = null
const { mutate: closeRoom } = useCloseRoom();

// Cấu hình RTCPeerConnection
const rtcConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

// Hàm bật/tắt camera
const toggleCamera = async () => {
  myCameraOn.value = !myCameraOn.value
  channel.whisper('camera-state-changed', {
    userId: profile.user?.id,
    isCameraOn: myCameraOn.value,
  })

  if (myCameraOn.value) {
    try {
      // Lấy local stream từ thiết bị
      localStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

      // Với mỗi thành viên khác, nếu chưa có kết nối thì tạo kết nối và gửi offer
      users.value.forEach((member: any) => {
        if (member.id === profile.user?.id) return

        if (!peerConnections[member.id]) {
          const pc = new RTCPeerConnection(rtcConfiguration)
          peerConnections[member.id] = pc

          // Thêm các track từ localStream vào kết nối
          localStream.value?.getTracks().forEach((track) => {
            pc.addTrack(track, localStream.value!)
          })

          // Lắng nghe sự kiện ontrack để nhận remote stream
          pc.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
              remoteStreams[member.id] = event.streams[0]
            }
          }

          // Gửi ICE candidate qua signaling (sử dụng whisper; ép kiểu channel sang any)
          pc.onicecandidate = (event) => {
            if (event.candidate) {
              (channel as any).whisper('webrtc.signal', {
                to: member.id,
                from: profile.user?.id,
                candidate: event.candidate
              })
            }
          }

          // Tạo offer và gửi qua signaling
          pc.createOffer()
            .then((offer) => pc.setLocalDescription(offer))
            .then(() => {
              (channel as any).whisper('webrtc.signal', {
                to: member.id,
                from: profile.user?.id,
                sdp: peerConnections[member.id].localDescription
              })
            })
            .catch((error) => {
              console.error('Error creating offer: ', error)
            })
        }
      })
    } catch (error) {
      console.error('Error getting local stream', error)
    }
  } else {
    // Tắt camera: dừng localStream và đóng các kết nối WebRTC
    if (localStream.value) {
      localStream.value.getTracks().forEach((track) => track.stop())
      localStream.value = null
    }
    Object.values(peerConnections).forEach((pc) => pc.close())
    for (const key in peerConnections) {
      delete peerConnections[key]
    }
    for (const key in remoteStreams) {
      delete remoteStreams[key]
    }
  }
}

// --- Các sự kiện của Laravel Echo ---
onMounted(() => {
  channel = echo.join(`room.${roomId.value}`)
    .here((members: any[]) => {
      // Lưu danh sách thành viên ban đầu
      users.value = members
      console.log('Các thành viên hiện có:', members)
    })
    .joining((member: any) => {
      // Khi có user mới join
      users.value.push(member)
      console.log('Thành viên join:', member)

      // Nếu mình đang bật camera thì tạo kết nối mới cho user mới join
      if (myCameraOn.value && localStream.value) {
        const pc = new RTCPeerConnection(rtcConfiguration)
        peerConnections[member.id] = pc
        localStream.value.getTracks().forEach((track) => {
          pc.addTrack(track, localStream.value!)
        })

        pc.ontrack = (event) => {
          if (event.streams && event.streams[0]) {
            remoteStreams[member.id] = event.streams[0]
          }
        }

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            (channel as any).whisper('webrtc.signal', {
              to: member.id,
              from: profile.user?.id,
              candidate: event.candidate
            })
          }
        }

        pc.createOffer()
          .then((offer) => pc.setLocalDescription(offer))
          .then(() => {
            (channel as any).whisper('webrtc.signal', {
              to: member.id,
              from: profile.user?.id,
              sdp: pc.localDescription
            })
          })
          .catch(console.error)
      }
    })
    .leaving((member: any) => {
      users.value = users.value.filter((u) => u.id !== member.id)
      if (peerConnections[member.id]) {
        peerConnections[member.id].close()
        delete peerConnections[member.id]
      }
      if (remoteStreams[member.id]) {
        delete remoteStreams[member.id]
      }
      console.log('Thành viên leave:', member)
    })
    .listen('.room.status.changed', (data: any) => {
      roomStatus.value = data.room.status
      console.log('Trạng thái phòng thay đổi:', data.room.status)
    })
    .listenForWhisper('webrtc.signal', async (data: any) => {
      if (data.to !== profile.user?.id) return

      let pc = peerConnections[data.from]

      if (!pc) {
        pc = new RTCPeerConnection(rtcConfiguration)
        peerConnections[data.from] = pc

        if (localStream.value) {
          localStream.value.getTracks().forEach((track) => {
            pc.addTrack(track, localStream.value!)
          })
        }

        pc.ontrack = (event) => {
          if (event.streams && event.streams[0]) {
            remoteStreams[data.from] = event.streams[0]
          }
        }

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            (channel as any).whisper('webrtc.signal', {
              to: data.from,
              from: profile.user?.id,
              candidate: event.candidate
            })
          }
        }
      }

      // --- Xử lý SDP ---
      if (data.sdp) {
        const remoteDesc = new RTCSessionDescription(data.sdp)

        // Nếu SDP là answer và state không phù hợp, bỏ qua
        if (remoteDesc.type === 'answer' && pc.signalingState !== 'have-local-offer') {
          console.warn('Bỏ qua setRemoteDescription(answer) vì signalingState:', pc.signalingState)
        } else {
          // Tránh set lại SDP trùng
          if (!pc.remoteDescription || pc.remoteDescription.sdp !== remoteDesc.sdp) {
            try {
              await pc.setRemoteDescription(remoteDesc)
              if (remoteDesc.type === 'offer') {
                const answer = await pc.createAnswer()
                await pc.setLocalDescription(answer)
                if (pc.localDescription) {
                  (channel as any).whisper('webrtc.signal', {
                    to: data.from,
                    from: profile.user?.id,
                    sdp: pc.localDescription
                  })
                }
              }
            } catch (error) {
              console.error('Error handling SDP:', error)
            }
          }
        }
      }

      // --- Xử lý ICE candidate ---
      if (data.candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
        } catch (error) {
          console.error('Error adding ICE candidate:', error)
        }
      }
    })
    .listenForWhisper('camera-state-changed', (data: any) => {
      const user = users.value.find(u => u.id === data.userId)
      if (user) {
        user.isCameraOn = data.isCameraOn
      }
    })
})

onBeforeUnmount(() => {
  if (isRoomEmpty()) {
    closeRoom({ roomCode: roomId.value ?? null });
  }

  echo.leave(`room.${roomId.value}`)

  if (localStream.value) {
    localStream.value.getTracks().forEach((track) => track.stop())
  }

  Object.values(peerConnections).forEach((pc) => pc.close())
})

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
  <div v-if="roomId">
    <h2>Danh sách thành viên:</h2>
    <TransitionGroup name="zoom" tag="div" :style="{ display: 'flex', gap: '16px' }">
      <Flex v-for="user in users" :key="user.id" direction="column" gap="8px" justify="center" align="center">
        <template v-if="user.id === profile.user?.id">
          <Camera
            v-if="myCameraOn"
            :isCameraOn="myCameraOn"
            @camera-state="(val) => (myCameraOn = val)"
          />
          <NuxtImg
            v-else
            src="https://storage.googleapis.com/a1aa/image/RaL_g8i84sWSjFMAMfTuN7RQGSJfvmFnuK7txbYprHs.jpg"
            preload
            format="webp"
            width="360"
            height="240"
            draggable="false"
            loading="lazy"
            style="transition: transform 0.3s; transform: scale(1); object-fit: cover;"
            @mouseover="$event.target.style.transform = 'scale(1.05)'"
            @mouseleave="$event.target.style.transform = 'scale(1)'"
          />
        </template>
          <template v-else>
          <!-- Nếu có remote stream của user đó, hiển thị video -->
          <video
            v-if="remoteStreams[user.id]"
            :ref="el => setRemoteVideo(el, user.id)"
            autoplay
            playsinline
            width="360"
            height="240"
            style="object-fit: cover; transition: transform 0.3s;"
          ></video>
          <!-- Nếu chưa có remote stream, hiển thị avatar -->
          <NuxtImg
            v-else
            src="https://storage.googleapis.com/a1aa/image/RaL_g8i84sWSjFMAMfTuN7RQGSJfvmFnuK7txbYprHs.jpg"
            preload
            format="webp"
            width="360"
            height="240"
            draggable="false"
            loading="lazy"
            style="transition: transform 0.3s; transform: scale(1); object-fit: cover;"
            @mouseover="$event.target.style.transform = 'scale(1.05)'"
            @mouseleave="$event.target.style.transform = 'scale(1)'"
          />
        </template>
        <Button @click="toggleCamera" v-if="user.id == profile.user?.id">
          {{ myCameraOn ? "Tắt Camera" : "Bật Camera" }}
        </Button>
        <p>{{ user.name }}</p>
      </Flex>
    </TransitionGroup>
  </div>
  <Flex gap="8px">  
    <Box :style="{ width: '100%', height: (!isMobile && !isTablet) ? '900px' : '400px', position: 'relative', margin: '1rem 0' }">
      <vue-plyr @pause="handlePause" :poster="movie.poster" :style="{ width: '100%', height: '100%', position: 'absolute', objectFit: 'cover' }">
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
            <Button label="Yêu thích" icon="pi pi-heart-fill" :style="{ backgroundColor: '#dc2626', border: 'none' }" />
          </Flex>
        </Flex>
      </Flex>
      <Divider v-show="!isMobile && !isTablet"/>
      <Box :style="{ width: '100%' }">
        <Flex :align="(isDesktop || isLaptop) ? 'center' : 'flex-start'" :style="{ marginBottom: '1.5rem!important' }" gap="16px" :direction="(isDesktop || isLaptop) ? 'row' : 'column'">
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
    </Flex>
    <Box :style="{ width: (isDesktop || isLaptop) ? 'auto' : '100%', maxWidth: isDesktop ? '440px' : 'none', minWidth: '440px', padding: isDesktop ? '1rem 2.5rem' : '1rem .5rem' }">
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