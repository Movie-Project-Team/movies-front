<script setup lang="ts">
import { computed } from 'vue';
import Button from 'primevue/button';
import Flex from '../atoms/Flex.vue';

const props = defineProps<{ 
  currentPage: number; 
  totalPages: number; 
  maxVisiblePages?: number;
}>();

const emit = defineEmits(['changePage']);

const visiblePages = computed(() => {
  const pages: number[] = [];
  const startPage = Math.max(1, props.currentPage - Math.floor((props.maxVisiblePages ?? 5) / 2));
  const endPage = Math.min(props.totalPages, startPage + (props.maxVisiblePages ?? 5) - 1);
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});
</script>

<template>
  <Flex justify="center" align="center" gap="10px">
    <Button icon="pi pi-angle-double-left" @click="emit('changePage', 1)" :disabled="currentPage === 1" severity="secondary" />
    <Button icon="pi pi-angle-left" @click="emit('changePage', currentPage - 1)" :disabled="currentPage === 1" severity="secondary" />
    <Button
      v-for="page in visiblePages"
      :key="page"
      :label="page.toString()"
      @click="emit('changePage', page)"
      :class="{ 'active': currentPage === page }"
      :severity="currentPage === page ? 'primary' : 'secondary'"
    />
    <Button icon="pi pi-angle-right" @click="emit('changePage', currentPage + 1)" :disabled="currentPage === totalPages" severity="secondary" />
    <Button icon="pi pi-angle-double-right" @click="emit('changePage', totalPages)" :disabled="currentPage === totalPages" severity="secondary" />
  </Flex>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: 10px;
}
.active {
  font-weight: bold;
}
</style>
