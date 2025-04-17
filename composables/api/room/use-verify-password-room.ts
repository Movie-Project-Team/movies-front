import { useMutation } from "@tanstack/vue-query";
import { apiReClient } from "~/utils/apiReClient";
import { useLoadingStore } from "~/stores/loading";

const ENDPOINT = '/room/verify';

interface VerifyPasswordPayload {
  roomId: number;
  password: string;
}

const loginMutationFn = async (payload: VerifyPasswordPayload) => {
  const api = apiReClient();
  const response = await api<RoomDetailResponse>(`${ENDPOINT}`, {
    method: 'POST',
    body: payload,
  });
  
  return response;
};

export const useVerifyPasswordRoom = () => {
  const loading = useLoadingStore();

  const mutation = useMutation({
    mutationFn: loginMutationFn,
    onMutate: () => {
      loading.show();
    },
    onSuccess: (data: RoomDetailResponse) => {
      loading.hide();
    },
    onError: (error: any) => {
      loading.hide();
    },
  });

  return {
    ...mutation,
  };
};
