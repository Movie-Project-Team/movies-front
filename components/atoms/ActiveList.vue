<script setup lang="ts">
import Box from '../atoms/Box.vue';
import Flex from '../atoms/Flex.vue';
import { ref } from "vue";

const props = defineProps<{
  data: {
    label: string;
    items: any[];
  };
}>();

const route = useRoute();
const activeItem = ref<number | null>(0);

const itemSlugs = computed(() => props.data.items.map(item => typeof item === 'object' ? item.slug : item));
const queryMap: Record<string, string> = {
  "Quốc gia": "lang",
  "Thể loại": "gen",
  "Năm phát hành": "year",
  "Đánh giá": "rating",
  "Trạng thái phim": "status",
  "Loại phim": "type",
};

const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/\s+/g, "-");
};

watchEffect(() => {
  const queryKey = queryMap[props.data.label];
  if (!queryKey || !route.query[queryKey]) return;

  const queryValue = route.query[queryKey];
  const index = props.data.items.findIndex(item => {
    if (typeof item === "object") {
      return item.slug === queryValue || item.title === queryValue;
    }
    return toSlug(item) === queryValue;
  });

  activeItem.value = index !== -1 ? index : null;
});


const emit = defineEmits<{
  (e: "update", value: string): void;
}>();

const setActive = (index: number) => {
  activeItem.value = index;
  const selectedValue = toSlug(itemSlugs.value[index]); 
  emit("update", selectedValue);
};
</script>

<template>
  <Box>
    <Flex gap="40px" :style="{ padding: '16px 20px', fontSize: '15px' }">
      <Box :style="{ width: '10%' }">
        <span :style="{ color: '#ffffff', fontWeight: 700 }">{{ data.label }}: </span> 
      </Box>
      <Flex gap="20px" wrap="wrap" :style="{ width: '90%' }">
        <span
          v-for="(item, index) in data.items"
          :key="index"
          @click="setActive(index)"
          :style="{
            color: activeItem === index ? 'yellow' : '#fff',
            opacity: activeItem === index ? '1' : '.8',
            cursor: 'pointer'
          }"
        >
          {{ item.title || item }}
        </span>
      </Flex>
    </Flex>
  </Box>
</template>

<style scoped></style>
