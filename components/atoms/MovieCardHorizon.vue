<script setup lang="ts">
import Flex from './Flex.vue';

const props = defineProps<{
  data: Movie;
}>();

</script>

<template>
  <Flex 
    :direction="'column'"
  >
    <NuxtImg 
      :src="data.poster" 
      :alt="data.poster" 
      :style="{
        width: '290px',
        height: '170px',
        borderRadius: '8px',
        objectFit: 'cover'
      }"
    />
    <h4 
      :style="{ 
        fontSize: '14px',
      }"
    >
      {{ data.title }}
    </h4>
  </Flex>
</template>

<style scoped></style>
