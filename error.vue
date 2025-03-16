<script setup lang="ts">
import type { NuxtError } from '#app'
import notFoundGif from '~/assets/images/not-found.gif'

const props = defineProps({
  error: Object as () => NuxtError
})

const error = props.error
const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="error-page">
    <div class="gif-container">
    </div>
    <h1 v-if="error?.statusCode === 404">404 - Không Tìm Thấy Trang</h1>
    <h1 v-else>Lỗi: {{ error?.statusCode }}</h1>
    <p v-if="error?.statusCode === 404">
      Rất tiếc, trang bạn yêu cầu không tồn tại. Có thể bạn đã nhập sai URL hoặc trang đã bị xóa.
    </p>
    <p v-else>
      Đã xảy ra lỗi: {{ error?.message }}
    </p>
    <Button @click="handleError" class="home-link">Quay lại trang chủ</Button>
  </div>
</template>

<style scoped>
.error-page {
  padding: 2rem;
  text-align: center;
  background: #141414;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.error-icon,
.clapper-icon {
  margin-bottom: 1rem;
}
.not-found-gif {
  max-width: 100%;
  height: auto;
}
.error-page h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.error-page p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}
.home-link {
  padding: 0.5rem 1rem;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background 0.3s;
  border: 'none'
}
.home-link:hover {
  background: #b20710;
}
</style>
