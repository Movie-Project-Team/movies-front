<script setup lang="ts">
import useResponsive from '~/composables/resize/use-responsive';
import Box from '../atoms/Box.vue';
import Flex from '../atoms/Flex.vue';

const props = defineProps<{ slug?: string; activeEpisode?: number | null; espData?: EpisodeResponse[]; server?: string }>();
const router = useRouter();
const { espData } = toRefs(props);

const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/\s+/g, "-");
};

const activeEpisode = ref<number | null>(props.activeEpisode || 1);
const handleEpisodeChange = (episode: number) => {
  activeEpisode.value = episode;
  router.push({
    path: `/xem-phim/${props.slug}`,
    query: { server: toSlug(String(props.server)), ep: episode },
  });
};

const { isLaptop, isDesktop } = useResponsive();
</script>

<template>
  <Box>
    <Flex
      gap="10px"
      wrap="wrap"
    >
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent"
      v-if="espData?.length === 0" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
      <Flex
        v-for="(episode, index) in espData"
        justify="center"
        align="center"
        @click="handleEpisodeChange(Number(episode.slug))"
        :key="index"
        :style="{
          opacity: activeEpisode == Number(episode.slug) ? '1' : '.8',
          backgroundColor: activeEpisode == Number(episode.slug) ? '#ffd875' : '#282b3a',
          width: (isDesktop || isLaptop) ? '146px' : '105px',
          height: '50px',
          borderRadius: '0.5rem',
          cursor: 'pointer',
        }"
        @mouseover="(e) => e.currentTarget.style.opacity = '0.7'"
        @mouseleave="(e) => e.currentTarget.style.opacity = '1'"
        v-else
        class="fade-in"
      > 
        <Flex 
          align="center"
          justify="center"
          :style="{
            fontSize: '0.875rem',
            gap: '0.5rem',
            color: activeEpisode == Number(episode.slug) ? '#191b24' : '#fff',
          }"
        >
          <i 
            class="pi pi-sort-down-fill" 
            :style="{
              fontSize: '1.2rem',
              color: activeEpisode == Number(episode.slug) ? '#191b24' : '#fff',
              transform: 'rotate(270deg)'
            }"/>
          Tập: {{ episode.slug }}
        </Flex>
      </Flex>
    </Flex>
  </Box>
</template>

<style scoped>
@keyframes fadeInBlue {
  0% {
    opacity: 0;
    transform: translateX(20px);
    
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.fade-in {
  animation: fadeInBlue .5s ease-in-out;
}
</style>
