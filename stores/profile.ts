// stores/profile.ts
import { defineStore } from 'pinia'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    user: null as Profile | null,
    isVerify: false
  }),
  actions: {
    setProfile(profile: Profile) {
      this.user = profile
    },
    clearProfile() {
      this.user = null
    },
    setVerifyStatus(isVerified: boolean) {
      this.isVerify = isVerified
    },
  },
  persist: true,
})
