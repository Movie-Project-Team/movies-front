import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { apiTmdb } from "@/utils/apiTmdb";

const fetchData = async (type: string, movieId: string): Promise<ImageTmdbResponse> => {
  const api = apiTmdb();
  const response = await api<ImageTmdbResponse>(`/${type}/${movieId}/images?include_image_language=en`, {
    method: 'GET',
  });
  
  return response;
};

export const useGetImage = (
  type: Ref<string> = ref(""),
  movieId: Ref<string> = ref(""),
) => {
  const enabled = computed(() => !!type.value && !!movieId.value);
  
  const query = useQuery({
    queryKey: ['movie-image', movieId, type],
    queryFn: () => fetchData(type.value, movieId.value),
    enabled,
    placeholderData: keepPreviousData,
    retry: 2,
    retryDelay: 1000
  });

  return {
    ...query,
  };
};
