<script setup lang="ts">
import Box from '../atoms/Box.vue';
import Flex from '../atoms/Flex.vue';
import { ref } from "vue";

const activeItem = ref<number | null>(null);

const menuItems = [
  "Hỏi-Đáp",
  "Chính sách bảo mật",
  "Điều khoản sử dụng",
  "Giới thiệu",
  "Liên hệ",
];

const setActive = (index: number) => {
  activeItem.value = index;
};
</script>

<template>
  <Box
    :style="{
      background: '#0f111a',
      height: '400px',
    }"
  >
    <Flex
      :style="{
        padding: '0 50px',
        width: '100%',
        maxWidth: '1900px',
        height: '100%'
      }"
    >
      <Flex
        direction="column"
        gap="30px"
        justify="center"
        :style="{
          width: '100%',
          maxWidth: '750px',
          height: '100%',
          fontSize: '14px'
        }"
      >
        <Flex gap="60px">
          <img src="https://streamvid.jwsuperthemes.com/wp-content/uploads/2023/02/logo.svg" alt="">
          <Flex gap="20px">
            <Avatar icon="pi pi-facebook" class="mr-2" shape="circle" />
            <Avatar icon="pi pi-tiktok" class="mr-2" shape="circle" />
            <Avatar icon="pi pi-instagram" class="mr-2" shape="circle" />
            <Avatar icon="pi pi-youtube" class="mr-2" shape="circle" />
            <Avatar icon="pi pi-github" class="mr-2" shape="circle" />
            <Avatar icon="pi pi-linkedin" class="mr-2" shape="circle" />
            <Avatar icon="pi pi-telegram" class="mr-2" shape="circle" />
          </Flex>
        </Flex>
        <Flex gap="20px">
          <span
            v-for="(item, index) in menuItems"
            :key="index"
            @click="setActive(index)"
            :style="{
              color: activeItem === index ? 'yellow' : 'white',
            }"
          >
            {{ item }}
          </span>
        </Flex>
        <Flex gap="20px" :style="{ color: '#aaa', lineHeight: '1.6' }">
          <span>Rophim.net – Phim hay cả rổ - Trang xem phim online chất lượng cao miễn phí Vietsub, thuyết minh, lồng tiếng full HD. Kho phim mới khổng lồ, phim chiếu rạp, phim bộ, phim lẻ từ nhiều quốc gia như Việt Nam, Hàn Quốc, Trung Quốc, Thái Lan, Nhật Bản, Âu Mỹ… đa dạng thể loại. Khám phá nền tảng phim trực tuyến hay nhất 2024 chất lượng 4K!</span>
        </Flex>
      </Flex>
    </Flex> 
  </Box>
</template>

<style scoped></style>
