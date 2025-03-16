<script setup lang="ts">
import Box from './Box.vue';
import Flex from './Flex.vue';

</script>

<template>
  <Flex
    :style="{
      width: '160px',
      height: '230px',
      marginBottom: '14px'
    }"
    direction="column"
  >
    <NuxtImg 
      src="https://image.tmdb.org/t/p/w500/nsrFjmDDzo4FDMhxyvuVk4mPEH3.jpg" 
      alt="" 
      :style="{ 
        objectFit: 'cover', 
        width: '100%', 
        height: '100%',
        maskImage: 'linear-gradient(0deg, transparent 0, #000 60px)',
        borderRadius: '8px',
      }" />
    <Flex direction="column" align="center" :style="{ color: '#ffffff', marginTop: '-40px', zIndex: '100', fontSize: '14px' }">
      <span :style="{ lineHeight: '30px' }">Taito Ban</span>
      <span>Shun Mizushino (voice)</span>
    </Flex>
  </Flex>
</template>

<style scoped></style>
