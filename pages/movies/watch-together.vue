<script setup lang="ts">
import Box from '~/components/atoms/Box.vue';
import Flex from '~/components/atoms/Flex.vue';
import CreateRoomModal from '~/components/molecules/modal/CreateRoomModal.vue';
import MyRoomModal from '~/components/molecules/modal/MyRoomModal.vue';
import RoomBox from '~/components/molecules/RoomBox.vue';
import { useGetListRoom } from '~/composables/api/room/use-get-list-room';

const isOpenModal = ref(false);
const isOpenMyRoomModal = ref(false);

const { data, refetch, isLoading } = useGetListRoom();
</script>

<template>
  <Box
    :style="{
      padding: '150px 70px 100px'
    }"
  >
    <h1>Danh sách các phòng xem phim</h1>
    <Flex direction="column" gap="16px">
      <Flex gap="24px">
        <Button
          label="Tạo phòng"
          :style="{ padding: '10px', width: '220px' }"
          raised
          @click="isOpenModal = true"
        >
          <template #icon>
            <span class="material-icons" style="font-size: 24px; margin-right: 8px;">
              movie_edit
            </span>
          </template>
        </Button>
        <Button
          label="Phòng của bạn"
          :style="{ padding: '10px', width: '220px' }"
          raised
          @click="isOpenMyRoomModal = true"
        >
          <template #icon>
            <span class="material-icons" style="font-size: 24px; margin-right: 8px;">
              chair
            </span>
          </template>
        </Button>
      </Flex>
      <Flex wrap="wrap" gap="40px" v-show="isLoading">
        <Skeleton width="310px" height="400px" v-for="_ in 10" :key="_"/>
      </Flex>
      <Flex wrap="wrap" gap="40px">
        <RoomBox
          v-show="!isLoading"
          v-for="item in data?.data" 
          :data="item"
        />
      </Flex>
    </Flex>
    <CreateRoomModal 
      :visible="isOpenModal"
      @update:visible="isOpenModal = $event"
      :onSuccess="refetch"
    />
    <MyRoomModal 
      :visible="isOpenMyRoomModal"
      @update:visible="isOpenMyRoomModal = $event"
      :onSuccess="refetch"
    />
  </Box>
</template>

<style scoped></style>
