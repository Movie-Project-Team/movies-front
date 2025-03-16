<script setup lang="ts">
import Box from './Box.vue';
const props = defineProps<{
  align?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  basis?: string;
  grow?: string;
  shrink?: string;
  gap?: string;
  sx?: Record<string, string | number>;
}>();
</script>

<template>
  <Box
    :style="{
      display: 'flex',
      alignItems: align,
      justifyContent: justify,
      flexWrap: wrap,
      flexDirection: direction,
      flexBasis: basis,
      flexGrow: grow,
      flexShrink: shrink,
      gap: gap,
      ...sx,
    }"
  >
    <slot />
  </Box>
</template>

<style scoped></style>
