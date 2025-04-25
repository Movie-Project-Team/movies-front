<script setup lang="ts">
import Box from '../atoms/Box.vue';
import Flex from '../atoms/Flex.vue';
import CastList from './CastList.vue';
import EpisodeList from './EpisodeList.vue';

const props = defineProps<{ espCurrent?: string; movie?: Movie}>();
const activeItem = ref<number | null>(0);
const setActive = (index: number) => {
  activeItem.value = index;
};
const { movie } = toRefs(props)

// episodes
const episodes = computed(() => {
  if (movie.value?.episodes && movie.value.episodes.length > 0) {
    return movie.value.episodes[0].server_data ?? [];
  }
  return [];
});
const serverItems = computed(() => {
  if (movie.value?.episodes && movie.value.episodes.length > 0) {
    return movie.value.episodes ?? [];
  }
  return [];
});
</script>

<template>
  <Box>
    <Tabs value="0">
      <TabList>
        <Flex gap="20px">
          <Tab value="0">Tập phim</Tab>
          <Tab value="1">Diễn viên</Tab>
          <Tab value="2">Đề xuất</Tab>
        </Flex>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <Flex direction="column" :style="{ marginBottom: '1.5rem!important' }" gap="16px">
            <Flex gap="20px">
              <Flex
                v-for="(item, index) in serverItems"
                :key="index"
                align="center"
                gap="10px"
                @click="setActive(index)"
                :style="{
                  border: activeItem === index ? '1px solid yellow' : 'none',
                  padding: '8px',
                  fontSize: '12px',
                  borderRadius: '6px',
                  color: activeItem === index ? 'yellow' : '#fff',
                  opacity: activeItem === index ? '1' : '.8',
                  cursor: 'pointer'
                }"
              >
                <i class="pi pi-server" :style="{ color: activeItem === index ? 'yellow' : '#fff' }" />
                {{ item.server_name }}
              </Flex>
            </Flex>
            <ScrollPanel :style="{ width: '100%', overflow: 'auto', minHeight: '65px', maxHeight: '235px' }">
              <EpisodeList 
                :esp-current="espCurrent"
                :slug="movie?.slug"
                :esp-data="episodes"
              />
            </ScrollPanel>
          </Flex>
        </TabPanel>
        <TabPanel value="1">
          <CastList :type="movie?.type" :imdb="movie?.imdb"/>
        </TabPanel>
        <TabPanel value="2">
          <p class="m-0">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa
            qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
          </p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Box>
</template>

<style scoped></style>
