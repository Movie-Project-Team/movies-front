import { removeCookie } from "./cookie";

export const logout = () => {
    const profileStore = useProfileStore();
    removeCookie('access_token');
    profileStore.isVerify = false;
    profileStore.clearProfile();
    window.location.reload();
}
  