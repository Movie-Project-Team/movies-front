<template>
  <Flex
    class="notification-item"
    :style="{
      padding: '12px',
      borderBottom: '1px solid #fff2',
    }"
    gap="14px"
    align="center"
  >
    <!-- Icon -->
    <div
      :style="{
        width: '70px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: isEpisode ? '#DBEAFE' : '#FECACA',
      }"
    >
      <i
        :class="notification.type == 0 ? 'pi pi-video' : 'pi pi-wrench'"
        :style="{ color: isEpisode ? '#3B82F6' : '#DC2626' }"
      />
    </div>

    <!-- Nội dung thông báo -->
    <Flex direction="column" gap="2px">
      <Flex gap="8px" align="center" :style="{ maxHeight: '30px' }">
        <i :class="isEpisode ? 'pi pi-video' : 'pi pi-wrench'" :style="{ color: isEpisode ? '#3B82F6' : '#DC2626' }"></i>
        <h4 :style="{ fontWeight: '600', color: isEpisode ? '#2563EB' : '#B91C1C' }">
          {{ notification.title }}
        </h4>
      </Flex>
      <p :style="{ fontSize: '14px', margin: '0' }">
        <NuxtLink
          v-if="notification.link"
          :to="notification.link"
          :style="{ color: '#9CA3AF', textDecoration: 'none' }"
          @mouseover="hoverLink = true"
          @mouseleave="hoverLink = false"
          :class="{ 'hover-underline': hoverLink }"
        >
          {{ notification.message }}
        </NuxtLink>
        <span v-else :style="{ color: '#9CA3AF' }">{{ notification.message }}</span>
      </p>
      <p :style="{ fontSize: '12px' }">{{ notification.time }}</p>
    </Flex>
  </Flex>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Flex from "./Flex.vue";
// Nhận dữ liệu từ NotificationList
const props = defineProps<{ notification: NotificationItem }>();
// Xác định loại thông báo
const isEpisode = computed(() => props.notification.type === 0);
// Hiệu ứng hover cho link
const hoverLink = ref(false);
</script>

<style>
.hover-underline:hover {
  text-decoration: underline;
}
.notification-item:last-child {
  border-bottom: none !important;
}
</style>