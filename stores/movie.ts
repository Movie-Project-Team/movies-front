import { defineStore } from 'pinia';

export const useMovieStore = defineStore('movie', {
  state: () => ({
    selectedMovieId: null as number | null,
  }),
  actions: {
    setMovieId(id: number) {
      this.selectedMovieId = id;
    },
  },
  persist: true,
});
