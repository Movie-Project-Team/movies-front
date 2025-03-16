<script setup lang="ts">
import Box from '../atoms/Box.vue';
import Flex from '../atoms/Flex.vue';

const props = defineProps<{ 
  type: 'list' | 'ranking';
  isImageList?: boolean;
  numberData: number;
}>();
</script>

<template>
  <Box>
    <Flex v-show="type == 'list'" justify="space-between" wrap="wrap" :gap="isImageList ? '12px' : '8px'" :style="{ width: '100%' }">
      <Flex direction="column" justify="center" align="center" gap="4px" v-for="item in numberData">      
        <Skeleton 
          :width="isImageList ? '290px' : '221px'" 
          :height="isImageList ? '170px' : '331px'"
        />
        <Skeleton width="10rem" />
      </Flex>
    </Flex>
    <Flex v-show="type == 'ranking'" direction="column" gap="12px" align="flex-start" :style="{ width: '100%' }">
      <Flex justify="center" align="center" wrap="wrap" gap="4px" v-for="item in numberData">    
        <Skeleton width="25px" height="25px"/>
        <Skeleton width="25px" height="37.5px"/>
        <Skeleton width="10rem" />
      </Flex>
    </Flex>
  </Box>
</template>

<style scoped></style>
