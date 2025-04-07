import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { apiReClient } from "@/utils/apiReClient";

const ENDPOINT = '/movie/history';

const fetchData = async (profileId: number, movieId: number): Promise<WatchHistoryDetailResponse> => {
  const api = apiReClient();
  const response = await api<WatchHistoryDetailResponse>(`${ENDPOINT}/${profileId}/detail/${movieId}`, {
    method: 'GET',
  });
  return response;
};

export const useGetHistory = (
  profileId: Ref<number> = ref(0),
  movieId: Ref<number> = ref(0),
) => {
  const query = useQuery({
    queryKey: ['history-detail', profileId.value, movieId.value],
    queryFn: () => fetchData(profileId.value, movieId.value),
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
  };
};