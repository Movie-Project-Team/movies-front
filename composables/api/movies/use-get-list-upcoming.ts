import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { apiTmdb } from "@/utils/apiTmdb";

const ENDPOINT = '/discover/movie';

const fetchData = async (params: Record<string, string | number | boolean>): Promise<MovieTmdbResponse> => {
  const api = apiTmdb();
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  const response = await api<MovieTmdbResponse>(`${ENDPOINT}?${queryString}`, {
    method: 'GET',
  });
  return response;
};

export const useGetListUpcoming = (
  params: Ref<Record<string, string | number | boolean>> = ref({})
) => {
  const query = useQuery({
    queryKey: ['upcoming-list', params],
    queryFn: () => fetchData(params.value),
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
  };
};
