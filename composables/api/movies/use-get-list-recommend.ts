import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { apiReClient } from "@/utils/apiReClient";

const ENDPOINT = '/movies/recommend';

const fetchData = async (movieId: number): Promise<MovieResponse> => {
  const api = apiReClient();
  const response = await api<MovieResponse>(`${ENDPOINT}/${movieId}`, {
    method: 'GET',
  });
  return response;
};

export const useGetListRecommend = (
  movieId: Ref<number> = ref(0),
) => {
  const query = useQuery({
    queryKey: ['recommend-list', movieId.value],
    queryFn: () => fetchData(movieId.value),
    placeholderData: keepPreviousData,
    enabled: computed(() => !!movieId.value),
  });

  return {
    ...query,
  };
};
