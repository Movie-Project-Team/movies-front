import { useMutation } from "@tanstack/vue-query";
import { apiReClient } from "~/utils/apiReClient";
import { useLoadingStore } from "~/stores/loading";

const ENDPOINT = '/comment/create';

interface RegisterPayload {
  userId: number;
  movieId: number | null;
  parentId?: number | null;
  isApproved: number;
  content: string;
}
const commentMutationFn = async (payload: RegisterPayload) => {
  const api = apiReClient();
  const response = await api<MovieDetailResponse>(`${ENDPOINT}`, {
    method: 'POST',
    body: payload,
  });
  
  return response;
};

export const useComment = () => {
  const loading = useLoadingStore();

  const mutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: commentMutationFn,
    onMutate: () => {
      loading.show();
    },
    onSuccess: (dataResponse: MovieDetailResponse) => {
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
