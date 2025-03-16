import { defineNuxtPlugin } from '#app'
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'
import type { Plugin } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VuePlyr as unknown as Plugin, {
    plyr: {
      controls: [
        'play-large', // Lớn
        'restart', // Bắt đầu lại
        'rewind', // Quay lại
        'play', // Phát
        'fast-forward', // Tua nhanh
        'progress', // Tiến độ
        'current-time', // Thời gian hiện tại
        'duration', // Thời gian tổng
        'mute', // Tắt âm
        'volume', // Âm lượng
        'captions', // Phụ đề
        'settings', // Cài đặt
        'pip', // Hình trong hình
        'airplay', // Phát qua AirPlay
        'download', // Tải xuống
        'fullscreen', // Toàn màn hình
      ],
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
    }
  })
})
