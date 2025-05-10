// ~/config/movieSections.ts
import type { Component } from 'vue'

export interface MovieSectionConfig {
  key: string
  title: string
  ref: string
  params: Record<string, string|number>
  component: Component
}

export const movieSections: ReadonlyArray<MovieSectionConfig> = [
  {
    key: 'new',
    title: 'Phim Mới Nè Bà Con',
    ref: 'newSectionRef',
    params: { year: '2025', item: 20 },
    component: defineAsyncComponent(() => import('~/components/molecules/MovieList.vue')),
  },
  {
    key: 'cartoon',
    title: 'Tôi Không Muốn Là Wibu Nhưng Anime Cứ Ép Tôi Thôi',
    ref: 'hotSectionRef',
    params: { type: 'hoathinh', item: 12 },
    component: defineAsyncComponent(() => import('~/components/molecules/TopSlideSmall.vue')),
  },
  {
    key: 'korea',
    title: 'Phim Hàn Đủ Vị',
    ref: 'koreaSectionRef',
    params: { lang: 'han-quoc', year: '2025', item: 20 },
    component: defineAsyncComponent(() => import('~/components/molecules/MovieList.vue')),
  },
  {
    key: 'action',
    title: 'Chạy, Đấm, Nổ – Combo Đầy Đủ Không Cần Gói Gia Vị',
    ref: 'actionSectionRef',
    params: { gen: 'hanh-dong', year: '2025', type: 'single', item: 20 },
    component: defineAsyncComponent(() => import('~/components/molecules/MovieListV3.vue')),
  },
  {
    key: 'horrible',
    title: 'Sợ Ma, Nhưng Chắc Cũng Không Thể Từ Chối Phim Này',
    ref: 'horribleSectionRef',
    params: { gen: 'kinh-di', year: '2025', item: 20 },
    component: defineAsyncComponent(() => import('~/components/molecules/MovieList.vue')),
  },
] as const
