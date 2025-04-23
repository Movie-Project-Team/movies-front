import { useMutation } from "@tanstack/vue-query";
import { apiReClient } from "~/utils/apiReClient";
import { useLoadingStore } from "~/stores/loading";

const ENDPOINT = '/profile/favorite/create';

interface RegisterPayload {
  profileId: number;
  movieId: number | null;
}

interface FavoriteResponse {
  code: number;
  message: string;
}
const favoriteMutationFn = async (payload: RegisterPayload) => {
  const api = apiReClient();
  const response = await api<FavoriteResponse>(`${ENDPOINT}`, {
    method: 'POST',
    body: payload,
  });
  
  return response;
};

export const useCreateFavorite = () => {
  const loading = useLoadingStore();

  const mutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: favoriteMutationFn,
    onMutate: () => {
      loading.show();
    },
    onSuccess: (dataResponse: FavoriteResponse) => {
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
