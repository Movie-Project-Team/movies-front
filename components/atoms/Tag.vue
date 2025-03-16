<script setup lang="ts">
import Box from './Box.vue';

const props = defineProps<{
  content: string | number,
  subContent?: string | number,
  type?: 'imdb' | 'background' | 'classic' | 'topic' | string | undefined
}>();

const tagClass = computed(() => {
  switch (props.type) {
    case 'imdb':
      return 'tag-container-imdb';
    case 'background':
      return 'tag-container-background';
    case 'topic':
      return 'tag-container-topic';
    default:
      return 'tag-container-classic';
  }
});

</script>

<template>
  <Box :class="tagClass">
    {{ subContent }} {{ content }}
  </Box>
</template>

<style scoped>
.tag-container-imdb {
  background-color: transparent;
  border: 1px solid #f0d25c;
  border-radius: .33rem;
  color: #fff;
  font-weight: 500;
  cursor: default;
  line-height: 24px;
  font-size: 12px;
  padding: 0 .4rem;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
}

.tag-container-background {
  background-color: #fff;
  color: #000;
  font-weight: 500;
  display: flex;
  overflow: hidden;
  cursor: default;
  line-height: 26px;
  padding: 0 .5rem;
  flex-shrink: 0;
  border-radius: .33rem;
  align-items: center;
  font-size: 12px;
}

.tag-container-classic {
  background-color: #ffffff10;
  height: 26px;
  padding: 0 .4rem;
  color: #fff;
  display: inline-flex;
  border: 1px solid #fff;
  border-radius: .33rem;
  align-items: center;
  font-size: 12px;
}

.tag-container-topic {
  background-color: #ffffff10;
  height: 26px;
  padding: 0 .4rem;
  color: #fff;
  display: inline-flex;
  border-radius: .33rem;
  align-items: center;
  font-size: 12px;
}
</style>
