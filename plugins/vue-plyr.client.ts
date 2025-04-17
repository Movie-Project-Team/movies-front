import { defineNuxtPlugin } from '#app'
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'
import type { Plugin } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  // responsive
  const isClient = process.client
  const isMobile = isClient ? window.innerWidth < 768 : false
  
  const defaultControls = [
    'play-large', // Nút play lớn
    'restart',    // Bắt đầu lại
    'rewind',     // Quay lại
    'play',       // Phát
    'fast-forward',// Tua nhanh
    'progress',   // Tiến độ
    'current-time', // Thời gian hiện tại
    'duration',   // Thời gian tổng
    'mute',       // Tắt âm
    'volume',     // Âm lượng
    'captions',   // Phụ đề
    'settings',   // Cài đặt
    'pip',        // Picture in Picture
    'airplay',    // Phát qua AirPlay
    'download',   // Tải xuống
    'fullscreen', // Toàn màn hình
  ]
  
  const mobileControls = [
    'play-large',
    'progress',
    'current-time',
    'duration',
    'mute',
    'settings',
    'volume',
    'fullscreen'
  ]

  const plyrControls = !isMobile ? defaultControls : mobileControls

  nuxtApp.vueApp.use(VuePlyr as unknown as Plugin, {
    plyr: {
      controls: plyrControls,
      settings: ['captions', 'quality', 'speed'],
      quality: {
        default: 576,
        options: [1080, 720, 576]
      },
      speed: {
        selected: 1,
        options: [0.5, 1, 1.5, 2]
      },
      blankVideo: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4',
      classNames: {
        previewThumbnails: {
          // Tooltip thumbs
          thumbContainer: 'plyr__preview-thumb',
          thumbContainerShown: 'plyr__preview-thumb--is-shown',
          imageContainer: 'plyr__preview-thumb__image-container',
          timeContainer: 'plyr__preview-thumb__time-container',
          // Scrubbing
          scrubbingContainer: 'plyr__preview-scrubbing',
          scrubbingContainerShown: 'plyr__preview-scrubbing--is-shown',
        },
      },
      // Preview Thumbnails plugin
      previewThumbnails: {
        enabled: true,
        src: 'https://cdn.plyr.io/static/demo/thumbs/100p.vtt',
      },
      i18n: {
        restart: 'Khởi động lại',
        rewind: 'Quay lại {seektime}s',
        play: 'Phát',
        pause: 'Tạm dừng',
        fastForward: 'Tiến nhanh {seektime}s',
        seek: 'Tua',
        seekLabel: '{currentTime} của {duration}',
        played: 'Đã phát',
        buffered: 'Đã đệm',
        currentTime: 'Thời gian hiện tại',
        duration: 'Thời lượng',
        volume: 'Âm lượng',
        mute: 'Tắt tiếng',
        unmute: 'Mở tiếng',
        enableCaptions: 'Bật phụ đề',
        disableCaptions: 'Tắt phụ đề',
        download: 'Tải xuống',
        enterFullscreen: 'Vào chế độ toàn màn hình',
        exitFullscreen: 'Thoát chế độ toàn màn hình',
        frameTitle: 'Trình phát cho {title}',
        captions: 'Phụ đề',
        settings: 'Cài đặt',
        pip: 'PIP',
        menuBack: 'Quay lại menu trước',
        speed: 'Tốc độ',
        normal: 'Bình thường',
        quality: 'Chất lượng',
        loop: 'Lặp lại',
        start: 'Bắt đầu',
        end: 'Kết thúc',
        all: 'Tất cả',
        reset: 'Đặt lại',
        disabled: 'Vô hiệu',
        enabled: 'Kích hoạt',
        advertisement: 'Quảng cáo',
        qualityBadge: {
          2160: '4K',
          1440: '2K',
        }
      },
      // YouTube plugin
      youtube: {
        rel: 0, // No related vids
        showinfo: 0, // Hide info
        iv_load_policy: 3, // Hide annotations
        modestbranding: 1, // Hide logos as much as possible (they still show one in the corner when paused)
        // Custom settings from Plyr
        customControls: true,
        noCookie: false, // Whether to use an alternative version of YouTube without cookies
      }, 
    }
  })
})
