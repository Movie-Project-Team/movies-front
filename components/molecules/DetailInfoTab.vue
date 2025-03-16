<script setup lang="ts">
import Box from '../atoms/Box.vue';
import CastList from './CastList.vue';
import EpisodeList from './EpisodeList.vue';

const props = defineProps<{ espCurrent?: string; slug?: string}>();
</script>

<template>
  <Box>
    <Tabs value="0">
      <TabList>
          <Tab value="0">Tập phim</Tab>
          <Tab value="1">Diễn viên</Tab>
          <Tab value="2">Đề xuất</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <EpisodeList :esp-current="espCurrent" :slug="slug"/>
        </TabPanel>
        <TabPanel value="1">
          <CastList/>
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
