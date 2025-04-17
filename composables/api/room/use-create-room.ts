import { useMutation } from "@tanstack/vue-query";
import { apiReClient } from "~/utils/apiReClient";
import { useLoadingStore } from "~/stores/loading";

const ENDPOINT = '/room/create';

interface RegisterPayload {
  host_id: number;
  movie_id: number | null;
  is_locked: boolean;
  capacity: number;
  password?: string;
}
const roomMutationFn = async (payload: RegisterPayload) => {
  const api = apiReClient();
  const response = await api<RoomDetailResponse>(`${ENDPOINT}`, {
    method: 'POST',
    body: payload,
  });
  
  return response;
};

export const useRoom = () => {
  const loading = useLoadingStore();

  const mutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: roomMutationFn,
    onMutate: () => {
      loading.show();
    },
    onSuccess: (dataResponse: RoomDetailResponse) => {
      loading.hide();
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
