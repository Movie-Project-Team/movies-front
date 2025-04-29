<script setup lang="ts">
import Flex from '../atoms/Flex.vue';
import Box from '../atoms/Box.vue';

const router = useRouter();
const menuItems = ref([
  { label: 'Thông tin', icon: 'pi pi-info-circle', route: '/profile' },
  {
    label: 'Quản lý Profile',
    icon: 'pi pi-user',
    children: [
      { label: 'Đổi mật khẩu', route: '/' }, 
      { label: 'Thêm Profile', route: '/' },
      { label: 'Sửa Profile', route: '/' },
    ]
  },
  { label: 'Danh sách yêu thích', icon: 'pi pi-heart', route: '/profile/favorite' },
  { label: 'Danh sách xem tiếp', icon: 'pi pi-caret-right', route: '/profile/favorite' },
  { label: 'Cài đặt', icon: 'pi pi-cog', route: '/' },
]);

const activeRoute = ref(router.currentRoute.value.path);
const activeIndex = ref(null);

watch(() => router.currentRoute.value.path, (newPath) => {
  activeRoute.value = newPath;
  activeIndex.value = null;
});

const toggleMenu = (index: any) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};

const navigateTo = (route: any) => {
  router.push(route);
  activeRoute.value = route;
  activeIndex.value = null;
};

// profile infomation
const profile = useProfileStore();
</script>

<template>
  <Flex
    :sx="{
      borderRight: '1px solid #f1f1f4',
      width: '270px',
    }"
    direction="column"
    gap="8px"
  >
    <Flex
      :sx="{
        height: '70px',
      }"
      align="center"
      gap="12px"
    >
      <Avatar :image="profile.user?.avatar" class="mr-2" size="large" shape="circle" />
      <Flex direction="column">
        <h4 :style="{ margin: '4px 0px' }">{{ profile?.user?.name }}</h4>
        <p :style="{ color: '#6c757d', fontSize: '14px', margin: '0' }">Người lớn</p>
      </Flex>
    </Flex>
    <Flex       
      :sx="{
        paddingRight: '16px',
        width: '100%'
      }"
    >
      <ul class="menu" :style="{ width: '100%' }">
        <li v-for="(item, index) in menuItems" :key="index">
          <Flex
            class="menu-item"
            :class="{ active: activeRoute === item.route || activeIndex === index }"
            @click="item.children ? toggleMenu(index) : navigateTo(item.route)"
            align="center"
            justify="space-between"
          >
            <Flex gap="24px" align="center">
              <i :class="item.icon"></i>
              <span :style="{ color: '#ffffff' }">
                {{ item.label }}
              </span>
            </Flex>
            <Box>          
              <i :class="activeIndex === index ? 'pi pi-minus' : 'pi pi-plus'" v-if="item.children" :style="{ fontSize: '12px' }"></i>
              <Box v-else/>
            </Box>
          </Flex>

          <!-- Submenu -->
          <transition name="collapse">
            <ul v-if="activeIndex === index && item.children" class="submenu">
              <Flex>              
                <Divider layout="vertical"/>
                <Box :style="{ width: '100%' }">
                  <li
                    v-for="(subItem, subIndex) in item.children"
                    :key="subIndex"
                    class="submenu-item"
                    :class="{ active: activeRoute === subItem.route }"
                    @click="navigateTo(subItem.route)"
                  >
                    {{ subItem.label }}
                  </li>
                </Box>
              </Flex>
            </ul>
          </transition>
        </li>
      </ul>
    </Flex>
  </Flex>
</template>

<style scoped>
.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  padding: 12px 8px;
  cursor: pointer;
  transition: background 0.3s ease, font-weight 0.3s;
  font-size: 14px;
  font-weight: 500;
  color: #252F4A;
  line-height: 1.25rem;
}

.submenu-item:hover,
.menu-item:hover {
  background: #f3f4f6;
  color: #1B84FF;
}

.submenu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.submenu-item {
  padding: 10px 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease, font-weight 0.3s;
}

/* Animation */
.collapse-enter-active,
.collapse-leave-active {
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 200px;
  opacity: 1;
}

.dropdown-icon {
  transition: transform 0.3s;
  width: 12px;
  height: 12px;
}
</style>
