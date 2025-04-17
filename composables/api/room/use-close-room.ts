import { useMutation } from "@tanstack/vue-query";
import { apiReClient } from "~/utils/apiReClient";
import { useLoadingStore } from "~/stores/loading";

const ENDPOINT = '/room/close';

interface RegisterPayload {
  roomCode: any;
}
const roomMutationFn = async (payload: RegisterPayload) => {
  const api = apiReClient();
  const response = await api<RoomDetailResponse>(`${ENDPOINT}`, {
    method: 'POST',
    body: payload,
  });
  
  return response;
};

export const useCloseRoom = () => {
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
