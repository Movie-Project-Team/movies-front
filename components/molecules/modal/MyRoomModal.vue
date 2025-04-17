<script setup lang="ts">
import Box from '~/components/atoms/Box.vue';
import Flex from '~/components/atoms/Flex.vue';
import { useGetListCloseRoom } from '~/composables/api/room/use-get-list-close-room';
import RoomBox from '../RoomBox.vue';

const props = defineProps<{
  visible: boolean;
  onSuccess?: () => void;
}>();

const localVisible = ref(props.visible);
const emit = defineEmits(["update:visible"]);
watch(
  () => props.visible,
  (newVal) => {
    localVisible.value = newVal;
  }
);

const profileStore = useProfileStore();
const profileId = ref(profileStore.user?.id)
const { data, isLoading } = useGetListCloseRoom(profileId);

const confirm = useConfirm()
const router = useRouter()

const handleConfirmOpenRoom = (room: RoomResponse) => {
  confirm.require({
    message: 'Bạn có muốn mở phòng này không?',
    header: 'Xác nhận mở phòng',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Thoát',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Đồng ý'
    },
    accept: () => {
      router.push({
        path: `/xem-chung/${room.movie.slug}`,
        query: {
          room: room.room_code
        }
      });
    },
  });
}
</script>

<template>
  <Box>
    <Dialog 
      v-model:visible="localVisible" 
      modal 
      header="Tạo phòng" 
      :style="{ width: 'auto', maxWidth: '700px' }"
      @hide="emit('update:visible', false)"
    >
      <template #container="{ closeCallback }">
        <Flex :style="{ padding: '24px' }" direction="column" gap="16px">
          <Flex justify="center" gap="10px" align="center" :style="{ width: '100%' }">
            <h5
              :style="{
                color: '#00031C',
                fontSize: '21px',
                fontWeight: '700',
                margin: '0px'
              }"
            >Danh sách phòng của bạn</h5>
          </Flex>
          <Divider />
          <Flex justify="center" align="center" gap="20px" v-show="isLoading">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
          </Flex>
          <Flex wrap="wrap" gap="20px">
            <RoomBox
              v-show="!isLoading"
              :style="{ color: '#ffffff' }"
              v-for="item in data?.data" 
              :key="item.id"
              :data="item"
              @confirmOpenRoom="handleConfirmOpenRoom"
            />
            <ConfirmDialog />
          </Flex>
        </Flex>
      </template>
    </Dialog>
  </Box>
</template>

<style scoped></style>
