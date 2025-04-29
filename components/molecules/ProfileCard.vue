<script setup lang="ts">
import Flex from '../atoms/Flex.vue';
import PasswordProfileModal from '@/components/molecules/modal/PasswordProfileModal.vue';

const props = defineProps<{
  profile: Profile;
}>();

const isOpenPasswordModal = ref(false);
</script>

<template>
  <Flex direction="column" align="center" gap="8px" :style="{ width: '10rem', overflow: 'hidden', cursor: 'pointer' }" @click="isOpenPasswordModal = true">
    <NuxtImg 
      :src="profile.avatar" 
      alt=""
      :style="{
        width: '120px',
        height: '120px',
        objectFit: 'cover'
      }"
    />
    <span :style="{ fontWeight: '700' }">{{ profile.name }}</span>
  </Flex>
  <PasswordProfileModal 
    v-if="isOpenPasswordModal" 
    :visible="isOpenPasswordModal" 
    :password="profile.password" 
    :profile-id="profile.id"
    @update:visible="isOpenPasswordModal = $event"
  />
</template>

<style scoped>
</style>
