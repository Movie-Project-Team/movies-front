<script setup lang="ts">
import Box from '~/components/atoms/Box.vue';
import Flex from '~/components/atoms/Flex.vue';
import MovieListV2 from '~/components/molecules/MovieListV2.vue';
import SideBarProfile from '~/components/molecules/SideBarProfile.vue';
import { useGetProfile } from '~/composables/api/profile/use-get-profile';

const profile = useProfileStore();
const profileId = ref(String(profile.user?.id ?? ""));
const { data, isLoading } = useGetProfile(profileId);
const skeletonLoading = computed(() => isLoading.value);
</script>

<template>
  <Box
    :style="{
      padding: '150px 70px 60px'
    }"
  >
    <Flex>
      <SideBarProfile :style="{ minWidth: '270px' }"/>
      <Flex :style="{ padding: '0px 20px' }" direction="column" gap="20px">
        <h1 :style="{ margin: '0px' }">Danh sách phim yêu thích</h1>
        <MovieListV2 :data="data?.data.favorites" :is-loading="skeletonLoading"/>
      </Flex>
    </Flex>
  </Box>
</template>

<style scoped></style>
