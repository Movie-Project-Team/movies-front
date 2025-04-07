<script setup lang="ts">
import { ref } from "vue";

// Ref để tham chiếu thẻ video
const videoRef = ref<HTMLVideoElement | null>(null);

// Biến trạng thái camera, mặc định là false (tắt)
const isCameraOn = ref(false);

// Hàm bật camera
const openCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      isCameraOn.value = true; // Camera bật, hiển thị video
    }
  } catch (error) {
    console.error("Lỗi khi truy cập camera: ", error);
  }
};

// Hàm tắt camera
const closeCamera = () => {
  if (videoRef.value && videoRef.value.srcObject) {
    const stream = videoRef.value.srcObject as MediaStream;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop()); // Dừng luồng video
    videoRef.value.srcObject = null;
    isCameraOn.value = false; // Camera tắt, ẩn video
  }
};

// Hàm chuyển đổi trạng thái camera
const toggleCamera = () => {
  if (isCameraOn.value) {
    closeCamera();
  } else {
    openCamera();
  }
};
</script>

<template>
  <div>
    <video v-show="isCameraOn" ref="videoRef" width="640" height="480" autoplay></video>
    <Button @click="toggleCamera">
      {{ isCameraOn ? "Tắt Camera" : "Bật Camera" }}
    </Button>
  </div>
</template>