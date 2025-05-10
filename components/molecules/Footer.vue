<script setup lang="ts">
import useResponsive from '~/composables/resize/use-responsive';
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

const { isMobile, isTablet, isLaptop, isDesktop } = useResponsive();
</script>

<template>
  <Box
    :style="{
      background: '#161934',
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
          <Flex gap="20px" v-show="isDesktop">
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
          <span>Dreamland – Website phục vụ học tập, làm đồ án - Đây là một website được xây dựng với mục đích học tập và thực hiện đồ án cá nhân. Mọi nội dung phim ảnh trên trang chỉ dùng để minh họa, học hỏi và nghiên cứu kỹ thuật phát triển web. Trang không có giá trị thương mại, không phục vụ mục đích kinh doanh, và không lưu trữ hay phân phối nội dung bản quyền.</span>
        </Flex>
      </Flex>
    </Flex> 
  </Box>
</template>

<style scoped></style>
