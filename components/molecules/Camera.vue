<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  isCameraOn: boolean;
}>();

const emit = defineEmits<{
  (e: 'camera-state', state: boolean): void;
}>();

// Ref để tham chiếu thẻ video
const videoRef = ref<HTMLVideoElement | null>(null);

const openCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      emit('camera-state', true);
    }
  } catch (error) {
    console.error("Lỗi khi truy cập camera: ", error);
  }
};

const closeCamera = () => {
  if (videoRef.value && videoRef.value.srcObject) {
    const stream = videoRef.value.srcObject as MediaStream;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    videoRef.value.srcObject = null;
    emit('camera-state', false);
  }
}

watch(() => props.isCameraOn, (newVal) => {
  newVal ? openCamera() : closeCamera();
});

onUnmounted(() => {
  closeCamera();
});
</script>

<template>
  <div>
    <video v-if="isCameraOn" ref="videoRef" width="360" height="240" autoplay :style="{ objectFit: 'cover' }"></video>
    <NuxtImg
      v-else
      src="https://storage.googleapis.com/a1aa/image/RaL_g8i84sWSjFMAMfTuN7RQGSJfvmFnuK7txbYprHs.jpg"
      preload
      format="webp"
      :width="360"
      :height="240"
      draggable="false"
      loading="lazy"
      :style="{ transition: 'transform 0.3s', transform: 'scale(1)', objectFit: 'cover' }"
      @mouseover="$event.target.style.transform = 'scale(1.05)'"
      @mouseleave="$event.target.style.transform = 'scale(1)'"
    />
  </div>
</template>