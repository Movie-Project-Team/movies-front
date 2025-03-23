import { useMutation } from "@tanstack/vue-query";
import { apiReClient } from "~/utils/apiReClient";
import { useLoadingStore } from "~/stores/loading";

const ENDPOINT = '/profile/history/save';

interface HistoryPayload {
  profileId: number;
  movieId: number | null;
  timeProcess?: number | null;
  episode: number;
  lastWatchedAt: string;
}
const historyMutationFn = async (payload: HistoryPayload) => {
  const api = apiReClient();
  const response = await api<WatchHistoryDetailResponse>(`${ENDPOINT}`, {
    method: 'POST',
    body: payload,
  });
  
  return response;
};

export const useSaveHistory = () => {
  const loading = useLoadingStore();

  const mutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: historyMutationFn,
    onMutate: () => {
    },
    onSuccess: (dataResponse: WatchHistoryDetailResponse) => {

    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      loading.hide();
    },
  });

  return {
    ...mutation,
  };
};
