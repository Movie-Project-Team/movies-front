import { ref, onMounted, onBeforeUnmount } from 'vue';

// Utility function to track window width
export const useWindowWidth = () => {
  const screenWidth = ref(0);

  const updateScreenWidth = () => {
    if (typeof window !== 'undefined') {
      screenWidth.value = window.innerWidth;
    }
  };

  onMounted(() => {
    updateScreenWidth();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateScreenWidth);
    }
  });

  onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateScreenWidth);
    }
  });

  return screenWidth;
};
