// composables/useEcho.ts
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

Pusher.logToConsole = false

// Nếu bạn dùng Nuxt, process.env chỉ lấy được các biến đã được expose qua runtimeConfig (hoặc NUXT_PUBLIC_ trực tiếp)
export const useEcho = () => {
  // Tùy chọn: bật log nếu ở môi trường development
  if (process.env.NODE_ENV === 'development') {
    Pusher.logToConsole = true
  }

  // Lấy các biến môi trường từ runtime config
  const config = useRuntimeConfig().public
  const profileId = localStorage.getItem('profileId');
  const echo = new Echo({
    broadcaster: 'pusher',
    key: config.PUSHER_KEY, // dùng NUXT_PUBLIC_PUSHER_KEY
    cluster: config.PUSHER_APP_CLUSTER, // cấu hình cluster của Pusher, ví dụ: ap1
    forceTLS: config.PUSHER_SCHEME === 'https',
    // Nếu bạn dùng host riêng hoặc cấu hình khác:
    // wsHost: config.PUSHER_HOST || undefined,
    // wsPort: config.PUSHER_PORT ? Number(config.PUSHER_PORT) : undefined,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: 'http://localhost:8000/broadcasting/auth',
    auth: {
        headers: {
            Authorization: `Bearer ${getCookie('access_token')}`,
            'X-Profile-Id': profileId || '',
        },
    },
  })

  return echo
}