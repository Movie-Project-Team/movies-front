<script setup lang="ts">
import Box from '../atoms/Box.vue';
import Flex from '../atoms/Flex.vue';

const props = defineProps<{ espCurrent?: string; slug?: string; activeEpisode?: number | null }>();
const router = useRouter();

const episodeList = computed(() => {
  const espCurrent = props.espCurrent ?? "";
  if (!espCurrent) {
    return []; 
  }
  if (espCurrent.toLowerCase().includes('full') || espCurrent === "Tập 0") {
    return ['Full'];
  }

  const match = espCurrent.match(/\d+/);
  const totalEpisodes = match ? parseInt(match[0], 10) : 1;
  
  return Array.from({ length: totalEpisodes }, (_, i) => `${i + 1}`);
});

const activeEpisode = ref<number | null>(props.activeEpisode || 1);
const handleEpisodeChange = (episode: number) => {
  activeEpisode.value = episode;
  router.push({
    path: `/xem-phim/${props.slug}`,
    query: { server: "vietsub", ep: episode },
  });
};
</script>

<template>
  <Box>
    <Flex
      gap="10px"
      wrap="wrap"
    >
      <p style="color: white; font-size: 1rem;" v-if="episodeList.length === 0">Đang cập nhật</p>
      <Flex
        v-for="(episode, index) in episodeList"
        justify="center"
        align="center"
        @click="handleEpisodeChange(Number(episode))"
        :key="index"
        :style="{
          opacity: activeEpisode == Number(episode) ? '1' : '.8',
          backgroundColor: activeEpisode == Number(episode) ? '#ffd875' : '#282b3a',
          width: '146px',
          height: '50px',
          borderRadius: '0.5rem',
          cursor: 'pointer',
        }"
        @mouseover="(e) => e.currentTarget.style.opacity = '0.7'"
        @mouseleave="(e) => e.currentTarget.style.opacity = '1'"
        v-else
      > 
        <Flex 
          align="center"
          justify="center"
          :style="{
            fontSize: '0.875rem',
            gap: '0.5rem',
            color: activeEpisode == Number(episode) ? '#191b24' : '#fff',
          }"
        >
          <i 
            class="pi pi-sort-down-fill" 
            :style="{
              fontSize: '1.2rem',
              color: activeEpisode == Number(episode) ? '#191b24' : '#fff',
              transform: 'rotate(270deg)'
            }"/>
          Tập: {{ episode }}
        </Flex>
      </Flex>
    </Flex>
  </Box>
</template>

<style scoped></style>
