<script setup lang="ts">
import { IconField, InputIcon, Menu, OverlayBadge, Popover, Toolbar } from "primevue";
import Flex from "../atoms/Flex.vue";
import Box from "../atoms/Box.vue";
import MenuSideBar from "./MenuSideBar.vue";
import AuthModal from "./modal/AuthModal.vue";
import MultiProfileModal from "@/components/molecules/modal/MultiProfileModal.vue";
import { getCookie } from "~/utils/cookie";
import { logout } from "~/utils";
import { useGetListMovie } from "~/composables/api/movies/use-get-list-movie";
import NoticationItem from "../atoms/NoticationItem.vue";
import { useGetListNotification } from "~/composables/api/notification/use-get-list-notification";
import useResponsive from "~/composables/resize/use-responsive";

const isOpenModal = ref(false);
const isLoginSuccess = ref(false);
const isSearchVisible = ref(false);
const cookieAuth = getCookie("access_token");
const profileStore = useProfileStore();
const notificationRef = ref();
const router = useRouter();
const route = useRoute();

const toggleSearch = () => {
  isSearchVisible.value = !isSearchVisible.value;
};

const openAuthModal = () => {
  isOpenModal.value = true;
};

const handleLoginSuccess = (isSuccess: boolean) => {
  isLoginSuccess.value = isSuccess;
};

watch(profileStore, () => {
  if (profileStore.user) {
    isOpenModal.value = false;
    isLoginSuccess.value = false;
  }
})

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
    command: () => {
      router.push('/profile')
    },
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

const toggleNotification = (event: any) => {
  notificationRef.value.toggle(event);
};

onMounted(() => {
  const loginModalFlag = route.query.openLoginModal;
  if (loginModalFlag) {
    isOpenModal.value = true;
    router.replace({
      path: route.path,
      query: {
        ...route.query,
        openLoginModal: undefined,
      },
    });
  }
});

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

const goToSearchPage = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: "/tim-kiem",
      query: { 
        page: 1, 
        keyword: searchQuery.value.trim() 
      }
    });
  }
};

const profileId = ref<number>(Number(profileStore.user?.id));
const { data: notifications } = useGetListNotification(profileId)

// responsive
const { isLaptop, isDesktop } = useResponsive();
</script>

<template>
  <Toolbar
    :style="{
      border: '0px',
      width: '100%',
      borderRadius: '0px',
      height: isDesktop ? '90px' : '',
      padding: isDesktop ? '0px 70px' : '0px 20px',
      background: isDesktop ? 'none' : '#191b24',
      fontWeight: '600',
    }"
  >
    <template #start>
      <Flex :direction="(isDesktop || isLaptop) ? 'row' : 'row-reverse'" :style="{ visibility: isSearchVisible ? 'hidden' : 'visible' }">
        <img
          :src="`/images/logo.png`"
          alt=""
          :style="{
            width: !isDesktop ? '120px' : '200px',
          }"
          @click="router.push('/')"
        />
        <MenuSideBar @openAuthModal="openAuthModal"/>
      </Flex>
    </template>
    <template #end>
      <Flex align="center" gap="20px">
        <IconField
          :style="{
            position: !isDesktop ? 'absolute' : 'relative',
            width: !isDesktop ? 'calc(100% - 144px)!important' : 'auto!important',
            top: '0',
            left: '0',
          }"
          v-if="isSearchVisible || isDesktop"
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
            @keyup.enter="goToSearchPage"
            :style="{ width: 'calc(100% + 60px)' }"
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
        <template v-if="!isDesktop" :style="{ position: 'absolute' }">
          <i :class="!isSearchVisible ? 'pi pi-search' : 'pi pi-times'" style="cursor: pointer" @click="toggleSearch"></i>
        </template>
        <Box v-show="isDesktop">
          <OverlayBadge :value="notifications?.data.length" v-if="profileStore.isVerify && cookieAuth && (notifications?.data && notifications?.data.length > 0)" severity="danger" @click="toggleNotification">
            <Avatar icon="pi pi-bell" size="normal" />
          </OverlayBadge>
          <Avatar icon="pi pi-bell" size="normal" v-else @click="toggleNotification"/>
          <Popover ref="notificationRef">
            <Flex :style="{
              maxWidth: '350px',
              width: '350px',
            }" direction="column">
              <NoticationItem 
                v-for="item in notifications?.data ?? []"
                :notification="item" 
              />
            </Flex>
          </Popover>
        </Box>
        <Flex v-if="profileStore.isVerify && cookieAuth">
          <Avatar
            shape="circle"
            :image="profileStore.user?.avatar"
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
        <div v-else>
          <Button
            v-if="isDesktop"
            label="Đăng nhập"
            icon="pi pi-user"
            :style="{ padding: '10px' }"
            raised
            @click="isOpenModal = true"
          />
          <i
            v-else-if="isLaptop"
            class="pi pi-user"
            :style="{ padding: '10px', cursor: 'pointer' }"
            @click="isOpenModal = true"
          />
        </div>
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

<style scoped>
</style>
