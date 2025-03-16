<script setup lang="ts">
import { Dialog } from 'primevue';
import ProfileCard from '../ProfileCard.vue';
import Flex from '~/components/atoms/Flex.vue';
import Box from '~/components/atoms/Box.vue';
import { useGetListProfile } from '~/composables/api/profile/use-get-list-profile';

const props = defineProps<{
  visible: boolean;
}>();

const localVisible = ref(props.visible);
const emit = defineEmits(["update:visible"]);

const userId = ref(localStorage.getItem("userId") ?? "");
const { data, isLoading } = useGetListProfile(userId);

const profiles = computed(() => data.value?.data?.data ?? []);
</script>

<template>
 <Dialog
    v-model:visible="localVisible"
    modal
    header="Chào mừng trở lại!"
    :style="{
      minHeight: '280px',
      padding: '38px 70px 45px 70px',
      width: '580px',
    }"
    @hide="emit('update:visible', false)"
  >
    <template #container="{ closeCallback }">
      <Flex direction="column" gap="20px" :style="{ position: 'relative!important' }">
        <Box :style="{ position: 'absolute!important' }">
          <Button icon="pi pi-angle-left" variant="text" rounded aria-label="Cancel" @click="closeCallback"/>
        </Box>
        <Flex direction="column" gap="10px" align="center">
          <img src="https://streamvid.jwsuperthemes.com/wp-content/uploads/2023/02/logo_sin.svg" alt="" :style="{ width: '40px', height: '40px', objectFit: 'cover' }">
          <h5
            :style="{
              color: '#00031C',
              fontSize: '21px',
              fontWeight: '700',
              margin: '0px'
            }"
          >Ai đang xem vậy!!</h5>
        </Flex>
        <Flex justify="space-around">
          <Flex direction="column" gap="8px" v-if="isLoading" v-for="profile in profiles">
            <Skeleton size="7rem" />
            <Skeleton width="7rem" />
          </Flex>
          <ProfileCard v-else v-for="profile in profiles" :profile="profile"/>
        </Flex>
      </Flex>
    </template>
  </Dialog>
</template>

<style scoped></style>
