<script setup lang="ts">
import { IconField, InputIcon, Menu, OverlayBadge, Toolbar } from "primevue";
import Flex from "../atoms/Flex.vue";
import MenuSideBar from "./MenuSideBar.vue";
import AuthModal from "./modal/AuthModal.vue";
import MultiProfileModal from "@/components/molecules/modal/MultiProfileModal.vue";
import { getCookie } from "~/utils/cookie";
import { logout } from "~/utils";
import { useGetListMovie } from "~/composables/api/movies/use-get-list-movie";

const isOpenModal = ref(false);
const isLoginSuccess = ref(false);
const cookieAuth = getCookie("access_token");
const profileStore = useProfileStore();

const handleLoginSuccess = (isSuccess: boolean) => {
  isLoginSuccess.value = isSuccess;
};

const menu = ref();
const items = ref([
  {
    label: `Chào ${profileStore.user?.name}`,
  },
  {
    separator: true,
  },
  {
    label: "Yêu thích",
    icon: "pi pi-heart-fill",
  },
  {
    label: "Danh sách",
    icon: "pi pi-plus",
  },
  {
    label: "Xem tiếp",
    icon: "pi pi-refresh",
  },
  {
    label: "Tài khoản",
    icon: "pi pi-user",
  },
  {
    separator: true,
  },
  {
    label: "Đăng xuất",
    icon: "pi pi-sign-out",
    command: logout,
  },
]);

const toggle = (event: any) => {
  menu.value.toggle(event);
};

const searchQuery = ref("");
const suggestions = ref<Movie[]>([]);
const params = ref({
  "item": 10,
  "keyword": '',
});
const { data, refetch } = useGetListMovie(params, true);

const search = async (event: any) => {
  const query = event.query.toLowerCase().trim();
  params.value.keyword = query;

  if (!query) {
    suggestions.value = [];
    return;
  }
  
  await refetch();
  suggestions.value = data.value?.data ?? [];
};

const clearInput = () => {
  searchQuery.value = "";
  params.value.keyword = "";
  refetch();
};
</script>

<template>
  <Toolbar
    :style="{
      border: '0px',
      width: '100%',
      borderRadius: '0px',
      height: '90px',
      padding: '0px 70px',
      background: 'none',
      fontWeight: '600',
    }"
  >
    <template #start>
      <Flex>
        <img
          src="https://streamvid.jwsuperthemes.com/wp-content/uploads/2023/02/logo.svg"
          alt=""
        />
        <MenuSideBar />
      </Flex>
    </template>
    <template #end>
      <Flex gap="24px" align="center">
        <IconField
          :style="{
            position: 'relative',
          }"
        >
          <InputIcon>
            <i class="pi pi-search"></i>
          </InputIcon>
          <AutoComplete
            v-model="searchQuery"
            :suggestions="suggestions"
            @complete="search"
            placeholder="Tìm kiếm phim, diễn viên"
            @item-select="clearInput"
          >
            <template #option="slotProps">
              <NuxtLink :to="`/phim/${slotProps.option.slug}`" style="text-decoration: none; color: inherit;">
                <Flex gap="10px">
                  <NuxtImg
                    :src="slotProps.option.thumbnail"
                    alt="icon"
                    :style="{
                      width: '50px',
                      height: '100%',
                      objectFit: 'cover',
                    }"
                  />
                  <Flex
                    direction="column"
                    gap="14px"
                    justify="center"
                    align="flex-start"
                  >
                    <h4 :style="{ fontSize: '12px', margin: '0px' }">
                      {{ slotProps.option.title }}
                    </h4>
                    <h4 :style="{ fontSize: '12px', margin: '0px' }">
                      {{ slotProps.option.name }}
                    </h4>
                    <Flex :style="{ fontSize: '12px', color: '#aaa' }">
                      {{ slotProps.option.year }} 
                      <Divider layout="vertical" />
                      {{ slotProps.option.lang }}
                      <Divider layout="vertical" />
                      {{ slotProps.option.esp_total.replace('Tập', '').trim() }} Tập
                    </Flex>
                  </Flex>
                </Flex>
              </NuxtLink>
            </template>
            <template #header>
              <div
                :style="{
                  fontWeight: '700',
                  padding: '15px 15px 4px',
                }"
              >
                Danh sách phim
              </div>
            </template>
          </AutoComplete>
        </IconField>
        <OverlayBadge value="4" severity="danger">
          <Avatar icon="pi pi-bell" size="normal" />
        </OverlayBadge>
        <Flex v-if="profileStore.isVerify && cookieAuth">
          <Avatar
            shape="circle"
            image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
            @click="toggle"
            aria-haspopup="true"
            aria-controls="overlay_tmenu"
          />
          <Menu
            ref="menu"
            id="overlay_tmenu"
            :model="items"
            popup
            :style="{
              background: 'rgba(15, 17, 26, .95)',
              border: 'none',
              color: '#fff',
            }"
          />
        </Flex>
        <Button
          label="Đăng nhập"
          icon="pi pi-user"
          :style="{ padding: '10px' }"
          raised
          @click="isOpenModal = true"
          v-else
        />
      </Flex>
      <AuthModal
        :visible="isOpenModal"
        @authSuccess="handleLoginSuccess"
        @update:visible="isOpenModal = $event"
      />
      <MultiProfileModal
        v-if="isLoginSuccess"
        :visible="isLoginSuccess"
        @update:visible="isLoginSuccess = $event"
      />
    </template>
  </Toolbar>
</template>

<style scoped></style>
