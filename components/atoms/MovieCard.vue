<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import { useElementBounding } from '@vueuse/core';
import useResponsive from '~/composables/resize/use-responsive';
import Box from './Box.vue';
import Flex from './Flex.vue';
import { formatDate } from '~/utils/date';
import Tag from './Tag.vue';
import { useCreateFavorite } from '~/composables/api/profile/use-create-favorite';
import { useDeleteFavorite } from '~/composables/api/profile/use-delete-favorite';
import { useGetProfile } from '~/composables/api/profile/use-get-profile';
import { useToastMessage } from '~/composables/toast/useToastMessage';

const props = defineProps<{
  data: Movie | MovieTmdb;
  isVer2?: boolean;
  pos?: number;
}>();

const config = useRuntimeConfig();
const movieStore = useMovieStore();
const profile = useProfileStore();
const isMovie = (data: Movie | MovieTmdb): data is Movie => {
  return (data as Movie).slug !== undefined;
};

const router = useRouter();
const goToDetail = () => {
  if (isMovie(props.data)) {
    movieStore.setMovieId(props.data.id);
    router.push(`/phim/${props.data.slug}`);
  }
};

const tagItems = computed(() => [
  { content: isMovie(props.data) ? props.data.vote_average : "N/A", subContent: "IMBd", type: "imdb" },
  { content: "T12", type: "background" },
  { content: isMovie(props.data) ? props.data.year : "N/A" },
  { 
    content: isMovie(props.data) && props.data.season 
      ? `Phần ${props.data.season}` 
      : "Chưa cập nhật" 
  },
  { 
    content: isMovie(props.data) && props.data.esp_total 
      ? props.data.esp_total.toString().includes("Tập") 
        ? props.data.esp_total 
        : `${props.data.esp_total} Tập ` 
      : "Chưa cập nhật" 
  }
]);

const genreItems = [
  { content: "Hành Động", type: "topic" },
  { content: "Viễn Tưởng", type: "topic" },
  { content: "Phiêu Lưu", type: "topic" },
  { content: "Khoa Học", type: "topic" }
];

const defaultPoster = 'https://cdn.iconscout.com/icon/premium/png-512-thumb/film-error-12036009-9808452.png?f=webp&w=256';
const imageSrc = computed(() => {
  if (isMovie(props.data)) {
    return props.data.thumbnail || defaultPoster;
  }
  return props.data.poster_path ? `${config.public.imageTmdbDomain}/${props.data.poster_path}` : defaultPoster;
});

const formattedReleaseDate = computed(() => {
  return !isMovie(props.data) && props.data.release_date
    ? formatDate(new Date(props.data.release_date), "DD-MM-YYYY")
    : "";
});

// Responsive
const { isMobile, isTablet, isLaptop, isDesktop } = useResponsive();

// Sử dụng 2 biến để theo dõi trạng thái hover của card và overlay
// Thêm biến cardDelayed để xác định xem đã hover đủ thời gian (1s) chưa
const cardDelayed = ref(false);
const overlayHovered = ref(false);

// Timer delay
let hoverTimer: ReturnType<typeof setTimeout> | null = null;

// computed hiển thị overlay khi card (đã đủ thời gian delay) hoặc overlay đang được hover
const showLargeTitle = computed(() => cardDelayed.value || overlayHovered.value);

const cardRef = ref<HTMLElement | null>(null);
const bounds = useElementBounding(cardRef);

// Sử dụng useElementBounding để lấy tọa độ phần tử
let x = ref(0);
let y = ref(0);
let top = ref(0);
let right = ref(0);
let bottom = ref(0);
let left = ref(0);
let width = ref(0);
let height = ref(0);

const onCardMouseOver = () => {
  // Nếu chưa có timer, bắt đầu timer delay 1s để hiển thị overlay
  if (!hoverTimer) {
    hoverTimer = setTimeout(() => {
      cardDelayed.value = true;
      hoverTimer = null;
    }, 800);
  }
  if (cardRef.value) {
    x.value = bounds.x.value;
    y.value = bounds.y.value;
    top.value = bounds.top.value;
    right.value = bounds.right.value;
    bottom.value = bounds.bottom.value;
    left.value = bounds.left.value;
    width.value = bounds.width.value;
    height.value = bounds.height.value;
  }
};

const onCardMouseLeave = () => {
  if (hoverTimer) {
    clearTimeout(hoverTimer);
    hoverTimer = null;
  }

  if (!overlayHovered.value) {
    cardDelayed.value = false;
  }
};

// Xử lý hover cho overlay
const onOverlayMouseEnter = () => {
  overlayHovered.value = true;
};

const onOverlayMouseLeave = () => {
  if (hoverTimer) {
    clearTimeout(hoverTimer);
    hoverTimer = null;
  }
  overlayHovered.value = false;
};

// Đảm bảo hủy timer khi component bị unmount
onBeforeUnmount(() => {
  if (hoverTimer) {
    clearTimeout(hoverTimer);
  }
});

const overlayStyle = computed(() => {
  let styles: Record<string, string> = {
    position: 'absolute',
    top: `${top.value + window.scrollY}px`,
    width: '100%',
    maxWidth: '420px',
    borderRadius: '8px',
    background: '#2f3346',
    boxShadow: '0 5px 10px 0 rgba(0, 0, 0, .2)',
    zIndex: '1000'
  };

  const maxWidthHalf = parseInt(styles.maxWidth) / 2;
  if ((x.value + width.value / 2 - maxWidthHalf) < 0) {
    styles.left = `${left.value}px`;
  } else if (x.value + width.value + maxWidthHalf > window.innerWidth) {
    styles.right = `${width.value / 2}px`;
  } else {
    styles.left = `${left.value + width.value / 2 - maxWidthHalf}px`;
  }

  return styles;
});

// add favorite
const isFavorite = ref(false);
const createFavoriteMutation = useCreateFavorite();
const deleteFavoriteMutation = useDeleteFavorite();
const profileId = ref(String(profile?.user?.id ?? ""));
const { data: favoriteList } = useGetProfile(profileId);
const toast = useToastMessage();

watch(favoriteList, (list) => {
  if (list && props.data?.id) {
    isFavorite.value = list.data.favorites.some(item => item.id === props.data.id);
  }
}, { immediate: true });

const toggleFavorite = async () => {
  const payload = {
    profileId: Number(profile.user?.id),
    movieId: props.data.id,
  };

  if (!isFavorite.value) {
    try {
      await createFavoriteMutation.mutateAsync(payload);
      isFavorite.value = true;
      toast.success('Đã thêm vào yêu thích', `Phim ${props.data.title} đã được thêm vào danh sách yêu thích thành công!`);
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error('Lỗi', 'Không thể thực hiện thao tác. Vui lòng thử lại.');
    }
  } else {
    try {
      await deleteFavoriteMutation.mutateAsync(payload); 
      isFavorite.value = false;
      toast.info('Đã xoá khỏi yêu thích', `Phim ${props.data.title} đã được xoá khỏi danh sách yêu thích.`);
    } catch (error) {
      console.error("Error adding favorite:", error);
      toast.error('Lỗi', 'Không thể thực hiện thao tác. Vui lòng thử lại.');
    }
  }
};
</script>

<template>
  <div ref="cardRef" style="position: relative; overflow: visible;" class="movie-card">
    <Toast />
    <!-- Card chính -->
    <Flex 
      align="center" 
      gap="12px" 
      @mouseenter="onCardMouseOver" 
      @mouseleave="onCardMouseLeave"
      @click="goToDetail"
      :direction="isVer2 ? 'row' : 'column'" 
      :justify="isVer2 ? 'flex-start' : 'center'" 
      :style="{ cursor: 'pointer', maxWidth: (!isMobile && !isTablet) ? '221px' : '104px' }"
    >
      <Box
        :style="{
          fontWeight: '700',
          fontSize: '18px',
          opacity: '.3'
        }"
        v-if="isVer2"
        v-bind="$attrs"
      >
        {{ pos }}.
      </Box>
      <Box :style="{ 
        position: 'relative',
        minHeight: (isMobile || isTablet) ? '156px' : (!isVer2 ? '330px' : '0px'),
        height: (isMobile || isTablet) ? '156px' : (!isVer2 ? '330px' : '40px')
      }">
        <NuxtImg
          :src="imageSrc" 
          :alt="data.title"
          format="webp"
          loading="lazy"
          :style="{ 
            width: (isMobile || isTablet) ? '104px' : (isVer2 ? '25px' : '221px'),
            borderRadius: isVer2 ? '0px' : '8px',
            minHeight: (isMobile || isTablet) ? '156px' : (isVer2 ? '0px' : '330px'),
            maxHeight: (isMobile || isTablet) ? 'none' : (isVer2 ? '40px' : '330px'),
          }"
          @mouseover="(e: any) => e.currentTarget.style.opacity = '0.7'"
          @mouseleave="(e: any) => e.currentTarget.style.opacity = '1'"
        />
        <Box
          v-if="!isVer2"
          :style="{
            position:'absolute',
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            overflow: 'hidden',
            background: '#5e6070',
            borderRadius: '.3rem .3rem 0 0',
            boxShadow: '0 0 5px 2px rgba(0, 0, 0, .1)',
            padding: '0 6px'
          }"
        >
          <h1 
            :style="{
              textAlign: 'center',
              fontSize: '10px'
            }"
          >P.Đề</h1>
        </Box>
      </Box>
      <h4 
        :style="{ 
          fontSize: isVer2 ? '12px' : '14px',
          margin: '0px',
          display: '-webkit-box', 
          WebkitBoxOrient: 'vertical', 
          WebkitLineClamp: '1', 
          overflow: 'hidden'
        }"
      >
        {{ data.title }}
      </h4>
      <p v-if="!isMovie(props.data)" :style="{ fontSize: '14px', opacity: 0.6, margin: '0px' }">
        {{ formattedReleaseDate }}
      </p>
    </Flex>

    <!-- Overlay tiêu đề lớn xuất hiện khi hover -->
    <teleport to="body">
      <Flex
        v-if="(isMovie(data) && showLargeTitle && (isDesktop || isLaptop) && !isVer2)" 
        class="overlay-title animate-scale"
        :style="overlayStyle"
        direction="column"
        @mouseenter="onOverlayMouseEnter"
        @mouseleave="onOverlayMouseLeave"
      >
        <Flex 
          :style="{
            height: '236px',
            maxHeight: '236px',
            padding: '0px 0px 16px'
          }"
        >
          <NuxtImg
            :src="data.poster" 
            :alt="data.title"
            format="webp"
            loading="lazy"
            :style="{ 
              width: '100%',
              borderRadius: '8px 8px 0px 0px',
            }"
            sizes="(max-width: 600px) 100px, (max-width: 1200px) 200px, 221px" 
            :placeholder="[50, 25, 75, 5]"
            @mouseover="(e: any) => e.currentTarget.style.opacity = '0.7'"
            @mouseleave="(e: any) => e.currentTarget.style.opacity = '1'"
          />
        </Flex>
        <Flex
          direction="column"
          gap="16px"
          :style="{ padding: '0 24px 24px 24px' }"
        >
          <Flex direction="column">
            <h1 :style="{ fontSize: '15.6px', margin: '8px 0' }">{{ data.title }}</h1>
            <p :style="{ fontSize: '13px', margin: 0 }">{{ data.name }}</p>
          </Flex>
          <Flex gap="8px">
            <Button label="Xem phim" icon="pi pi-play" @click="goToDetail" :style="{ fontSize: '13px', width: profile?.user ? 'auto' : '100%' }"/>
            <Button label="Yêu thích" v-if="profile?.user"  icon="pi pi-heart" :style="{ backgroundColor: isFavorite ? '#dc2626' : '#ccc', border: 'none', fontSize: '13px' }" @click="toggleFavorite" />
            <Button label="Xem sau" v-if="profile?.user" icon="pi pi-bookmark" :style="{ background: 'none', border: '1px solid #ffffff', fontSize: '13px' }" />
          </Flex>
          <Flex direction="column" gap="16px">
            <Flex gap="8px" :justify="isMobile ? 'center' : 'flex-start'">
              <Tag
                v-for="(tag, index) in tagItems"
                :key="index"
                :content="tag.content ?? ''"
                :sub-content="tag.subContent"
                :type="tag.type"
              />
            </Flex>
            <Flex gap="8px" :justify="isMobile ? 'center' : 'flex-start'">
              <Tag v-for="(genre, index) in genreItems" :key="index" :content="genre.content" :type="'topic'"/>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </teleport>
  </div>
</template>

<style scoped>
@keyframes scaleUp {
  0% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1.1);
  }
}

@keyframes scaleDown {
  0% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(0.5);
  }
}

.overlay-title {
  pointer-events: auto;
  transition: transform 0.5s ease-in-out;
}

.animate-scale {
  animation: scaleUp 0.5s forwards;
}

.animate-scale-leave {
  animation: scaleDown 0.5s forwards;
}

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

.movie-card {
  animation: fadeInBlue .5s ease-in-out;
}
</style>