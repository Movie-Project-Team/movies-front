import { removeCookie } from "./cookie";

export const logout = () => {
    const profileStore = useProfileStore();
    removeCookie('access_token');
    profileStore.isVerify = false;
    profileStore.clearProfile();
    window.location.reload();
}
const extractNumber = (str: string): number => {
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
};
export function calculateWatchedPercentage(timeProcess: number, movieTimeStr: string = "3"): number {
    const movieTime = extractNumber(movieTimeStr) * 60 || 183;
    return (timeProcess / movieTime) * 100;
}