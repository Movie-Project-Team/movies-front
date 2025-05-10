<script setup lang="ts">
import Box from './Box.vue';
import Flex from './Flex.vue';

const props = defineProps<{
  data: Movie;
}>();
</script>

<template>
  <Box :style="{ paddingBottom: '100px' }">
    <Flex :style="{
      position: 'relative',
      background: `url(${data.poster}) center center / cover no-repeat`,
      width: '400px',
      height: '180px',
      borderRadius: '10px'
    }">
      <Flex 
        :style="{
          position: 'absolute',
          bottom: '-90px',
          left: '20px',
          zIndex: 10,
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          borderRadius: '8px',
          overflow: 'hidden'
        }"
        gap="8px"
      >
        <img
          :src="data.thumbnail"
          alt=""
          :style="{ width: '100px', height: '150px', maxHeight: '150px', maxWidth: '100px', borderRadius: '8px' }"
        />
        <Flex
          direction="column"
          gap="14px"
          justify="flex-end"
          align="flex-start"
        >
          <h4 :style="{ fontSize: '12px', margin: '0px' }">
            {{ data.title }}
          </h4>
          <h4 :style="{ fontSize: '12px', margin: '0px' }">
            {{ data.name }}
          </h4>
          <Flex :style="{ fontSize: '12px', color: '#aaa' }">
            {{ data.year }} 
            <Divider layout="vertical" />
            {{ data.lang }}
            <Divider layout="vertical" />
            {{ data.time }}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  </Box>
</template>

<style scoped>

</style>
