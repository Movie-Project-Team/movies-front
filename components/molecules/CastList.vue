<script setup lang="ts">
import CastItem from '../atoms/CastItem.vue';
import Flex from '../atoms/Flex.vue';

const props = defineProps<{ type?: string, imdb?: string }>();

</script>

<template>
  <Flex gap="14px" wrap="wrap" justify="flex-start" align="center">
    <CastItem v-for="(cast, index) in 10" :key="index"/>
  </Flex>
</template>

<style scoped></style>
