import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { apiReClient } from "@/utils/apiReClient";

const ENDPOINT = '/movies';

const fetchData = async (slug: string): Promise<MovieDetailResponse> => {
  const api = apiReClient();
  const response = await api<MovieDetailResponse>(`${ENDPOINT}/${slug}`, {
    method: 'GET',
  });
  
  return response;
};

export const useGetMovie = (
  slug: Ref<string> = ref(""),
) => {
  const query = useQuery({
    queryKey: ['movie-detail', slug.value],
    queryFn: () => fetchData(slug.value),
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
  };
};
