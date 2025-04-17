<script setup lang="ts">
import Box from '../atoms/Box.vue';
import Flex from '../atoms/Flex.vue';
import PasswordRoomModal from './modal/PasswordRoomModal.vue';

const props = defineProps<{
  data: RoomResponse;
  isLoading?: boolean;
}>();

const avatarImage: string[] = [
  "https://storage.googleapis.com/a1aa/image/viyXpdufmE8Q-HLizmD0iYsTHTWsHOp3f6gWHB1aX4g.jpg",
  "https://storage.googleapis.com/a1aa/image/PaPbXvvC5fAJFfx0Mk7zoOG0hnv5ZJwyiNMUeGf0mmM.jpg",
  "https://storage.googleapis.com/a1aa/image/RaL_g8i84sWSjFMAMfTuN7RQGSJfvmFnuK7txbYprHs.jpg",
  "https://storage.googleapis.com/a1aa/image/valxrWR2lDV83VxI9MOSsc9IxqA2djrMKp_3rT2UoSE.jpg",
  "https://storage.googleapis.com/a1aa/image/iQU1BPJC1qfhWWfxQM1dn3AHVlMvdBbqQ6HI9bPthqQ.jpg",
  "https://storage.googleapis.com/a1aa/image/BPtYw1UAlJXZ8TMCkkKyFM2qFGL0QU-Xe4wp0sp28i0.jpg",
  "https://storage.googleapis.com/a1aa/image/q4QUt3Pz7Fs9JnYgI8I4O4kaS6NQ1yVyLF85Co8jXfg.jpg",
  "https://storage.googleapis.com/a1aa/image/ifhSDfUpfqpBl8q1TvUhZj-eUt21JqV3UK5AWpokgpE.jpg",
  "https://storage.googleapis.com/a1aa/image/W0j9hDSKPvm6T25Dj4mjuTrwEbxBK_56iBpJQDCYcVU.jpg",
  "https://storage.googleapis.com/a1aa/image/IOMF8xr2_lVKRnIIDGUxjMkb4nDCI23G35f9LoaUoi0.jpg"
]

const roomImage: string[] = [
  "https://storage.googleapis.com/a1aa/image/OZmDRCt0ipNuDl_EHV489Vre8hrMVcReg4xjQ7SUeT0.jpg",
  "https://storage.googleapis.com/a1aa/image/fFv1V-ubvs3QaCX5d5lYlk4C5LL-y8g_vkQDpaXUEhI.jpg",
  "https://storage.googleapis.com/a1aa/image/jbzk1d_4rPOGcbJGrOh4stJFUT0VFCTvdEshEjQD2Rk.jpg",
  "https://i1.wp.com/greengarden.vn/wp-content/uploads/2023/12/House-decorated-for-the-traditional-New-Year12-1131x800.jpg?ssl=1",
  "https://t4.ftcdn.net/jpg/12/67/32/13/360_F_1267321355_OHDg2brvVHJElK3G5nbi3nqiPTS31Ejn.jpg",
  "https://3.gall-img.com/tdgall/files/attach/images/83261723/725/325/302/fb7eb92cce25f148f74445f7f1169e08.jpg",
  "https://img.lovepik.com/photo/60170/8728.jpg_wh860.jpg",
  "https://img.lovepik.com/photo/60170/8727.jpg_wh300.jpg",
]

const thumbNailRoom = computed<string>(() => {
  const index = Math.floor(Math.random() * roomImage.length)
  return roomImage[index]
})

const randomAvatars = computed<string[]>(() => {
  const shuffled = [...avatarImage].sort(() => Math.random() - 0.5)
  const min = 3
  const max = 7
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  return shuffled.slice(0, count)
})

const loadingState = ref(props.isLoading);
watch(() => props.isLoading, (newValue) => {
  loadingState.value = newValue;
});

const isOpenPasswordModal = ref(false)
const router = useRouter();

const emit = defineEmits(['confirmOpenRoom'])
const handleClickRoom = () => {
  if (props.data.is_locked && props.data.status === 0) {
    isOpenPasswordModal.value = true;
    return;
  }

  if (props.data.status === 1) {
    emit('confirmOpenRoom', props.data)
    return;
  }

  router.push({
    path: `/xem-chung/${props.data.movie.slug}`,
    query: {
      room: props.data.room_code
    }
  });
}

</script>

<template>
  <Box>
    <Flex 
      class="card-room"
      direction="column"
      :style="{
        position: 'relative',
        maxWidth: '310px',
        minWidth: '310px',
        height: '400px',
        borderRadius: '8px',
        background: '#2f3346',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
      }"
      @mouseover="(e: any) => {
        e.currentTarget.style.opacity = '0.7';
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.transition = 'all 0.3s ease';
      }"
      @mouseleave="(e: any) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.transform = 'scale(1)';
      }"
      @click="handleClickRoom"
    >
      <Flex
        direction="column"
        :style="{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '98%',
          height: '98%',
          padding: '24px',
          background: '#2f3346',
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px -1px rgba(0,0,0,0.1)',
        }"
      >
        <Skeleton v-show="loadingState" width="10rem" height="4rem"></Skeleton>
        <Flex gap="8px" v-show="!loadingState">
          <Avatar :image="thumbNailRoom" class="mr-2" size="xlarge" shape="circle" />
          <Flex direction="column">
            <h3 :style="{ margin: '4px 0px' }">{{ data.name }}</h3>
            <Flex gap="4px">
              <span :style="{ fontWeight: '600' }">Host: </span>
              <span>
                {{ data.host.name }} 
                <i class="pi pi-crown" style="color: rgb(234 179 8 / 1); cursor: pointer; font-size: 12px; margin-right: 6px"></i>
                <i class="pi pi-lock" style="color: rgb(234 179 8 / 1); cursor: pointer; font-size: 12px" v-if="data.is_locked"></i>
              </span>
            </Flex>
          </Flex>
        </Flex>
        <Flex direction="column">
          <h4>Thông tin phim: </h4>
          <Flex gap="8px">
            <NuxtImg
              :src="data.movie.thumbnail" 
              :alt="data.movie.thumbnail"
              format="webp"
              loading="lazy"
              :style="{ 
                width: '50px',
                borderRadius: '4px',
                minHeight: '50px',
              }"
              sizes="(max-width: 600px) 100px, (max-width: 1200px) 200px, 221px" 
              :placeholder="[50, 25, 75, 5]"
            />
            <Flex direction="column" gap="8px">
              <h4 
                :style="{ 
                  fontSize: '12px',
                  margin: '0px!important',
                  display: '-webkit-box', 
                  WebkitBoxOrient: 'vertical', 
                  WebkitLineClamp: '1', 
                  overflow: 'hidden'
                }"
              >
                {{ data.movie.title }}
              </h4>
            </Flex>
          </Flex>
        </Flex>
        <Flex direction="column">
          <h4 :style="{ margin: '12px 0px' }">Thời gian & trạng thái: </h4>
          <Flex gap="8px" direction="column">
            <Flex gap="4px">
              <span :style="{ fontWeight: '600' }">Giờ bắt đầu: </span><span>{{ data.created_at }}</span>
            </Flex>
            <Flex gap="4px">
              <span :style="{ fontWeight: '600' }">Số người tham gia: </span><span>{{ randomAvatars.length }}/{{ data.capacity }}</span>
            </Flex>
            <Flex gap="6px">
              <Avatar
                v-for="(avatar, index) in randomAvatars"
                :key="index"
                :image="avatar"
                shape="circle"
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
    <PasswordRoomModal 
      v-if="data.is_locked"
      :visible="isOpenPasswordModal"
      :room-id="data.id"
      @update:visible="isOpenPasswordModal = $event"
    />
  </Box>
</template>

<style scoped>
.card-room {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  overflow: hidden;
}
.card-room::before {
  position: absolute;
  content: ' ';
  display: block;
  top: -100px;
  left: 100px;
  width: 160px;
  height: 160%;
  background: linear-gradient(90deg, transparent, #1F80E0, #1F80E0, #1F80E0, #1F80E0, transparent);
  animation: rotation_481 5s infinite linear, colorChange 20s infinite steps(1);
}

@keyframes rotation_481 {
  0% {
    transform: rotateZ(0deg);
  }

  0% {
    transform: rotateZ(360deg);
  }
}

@keyframes colorChange {
  0% {
    background: linear-gradient(90deg, transparent, #1F80E0, #1F80E0, transparent);
  }
  20% {
    background: linear-gradient(90deg, transparent, #E01F8F, #E01F8F, transparent);
  }
  40% {
    background: linear-gradient(90deg, transparent, #1FE084, #1FE084, transparent);
  }
  60% {
    background: linear-gradient(90deg, transparent, #FFD700, #FFD700, transparent);
  }
  80% {
    background: linear-gradient(90deg, transparent, #ff9966, #ff9966, transparent);
  }
  100% {
    background: linear-gradient(90deg, transparent, #1F80E0, #1F80E0, transparent);
  }
}

</style>
