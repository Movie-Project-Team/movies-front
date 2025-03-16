<script setup lang="ts">

const props = defineProps<{ sx?: Record<string, string | number> }>()
</script>

<template>
  <div :style="{
    ...sx
  }">
    <slot />
  </div>
</template>

<style scoped></style>
