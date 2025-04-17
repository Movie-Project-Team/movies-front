<script setup lang="ts">
import useResponsive from '~/composables/resize/use-responsive';
import Flex from './Flex.vue';

const props = defineProps<{
  data: CastTmdb;
}>();

const config = useRuntimeConfig();
const { isMobile, isTablet, isLaptop, isDesktop } = useResponsive();
</script>

<template>
  <Flex
    :style="{
      width: (isLaptop || isDesktop) ? '160px' : '120px',
      height: '230px',
      marginBottom: '14px'
    }"
    direction="column"
  >
    <NuxtImg 
      :src="`${config.public.imageTmdbDomain}/${data.profile_path}`" 
      alt="" 
      :style="{ 
        objectFit: 'cover', 
        width: '100%', 
        height: '100%',
        maskImage: 'linear-gradient(0deg, transparent 0, #000 60px)',
        borderRadius: '8px',
      }" />
    <Flex direction="column" align="center" :style="{ color: '#ffffff', marginTop: '-40px', zIndex: '100', fontSize: '14px' }">
      <span :style="{ lineHeight: '30px' }">{{ data.name }}</span>
      <span>{{ data.character }}</span>
    </Flex>
  </Flex>
</template>

<style scoped></style>
