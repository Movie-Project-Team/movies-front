export const routes: Routes = {
  ROOT: {
    path: '/',
    title: 'Trang chủ',
    isPublic: true,
  },
  PHIM: {
    path: '/phim',
    title: 'Danh sách phim',
    isPublic: true,
  },
  MOVIES_DETAIL: {
    path: '/phim/:title',
    title: 'Chi tiết phim',
    isPublic: true,
  },
  XEM_PHIM: {
    path: '/xem-phim/:title',
    title: 'Xem phim',
    isPublic: true,
  },
  TIM_KIEM: {
    path: '/tim-kiem',
    title: 'Tìm kiếm',
    isPublic: true,
  },
  SAP_CHIEU: {
    path: '/sap-chieu',
    title: 'Phim sắp chiếu',
    isPublic: true,
  },
};
