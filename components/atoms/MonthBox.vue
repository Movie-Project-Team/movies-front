<script setup lang="ts">
import Flex from './Flex.vue';
defineProps<{ label: string }>();
</script>

<template>
  <Flex :style="{ background: '#22242c', padding: '20px', borderRadius: '6px', cursor: 'pointer' }">
    {{ label }}
  </Flex>
</template>
