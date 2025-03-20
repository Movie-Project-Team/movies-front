import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { apiReClient } from "@/utils/apiReClient";

const ENDPOINT = '/movies/ranking';

const fetchData = async (type: string): Promise<MovieResponse> => {
  const api = apiReClient();
  const response = await api<MovieResponse>(`${ENDPOINT}/${type}`, {
    method: 'GET',
  });
  return response;
};

export const useGetListRanking = (
  type: Ref<string> = ref(""),
) => {
  const query = useQuery({
    queryKey: ['ranking-list', type.value],
    queryFn: () => fetchData(type.value),
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
  };
};
