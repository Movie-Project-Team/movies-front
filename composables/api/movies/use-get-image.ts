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
  const query = useQuery({
    queryKey: ['movie-image', movieId.value],
    queryFn: () => fetchData(type.value, movieId.value),
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
  };
};
