import { useQuery } from "@tanstack/vue-query";
import { apiTmdb } from "@/utils/apiTmdb";

const ENDPOINT = '/find';

const fetchData = async (imdb: string): Promise<tvTMDBResponse> => {
  const api = apiTmdb();
  const response = await api<tvTMDBResponse>(`${ENDPOINT}/${imdb}?external_source=imdb_id`, {
    method: 'GET',
  });
  
  return response;
};

export const useGetMovieById = (
  imdb: Ref<string> = ref(""),
  type: Ref<string> = ref(""),
) => {
  const isEnabled = computed(() => {
    return imdb.value.includes("tt") && type.value === "tv";
  });

  const query = useQuery({
    queryKey: ['movie-tmdb-detail', imdb.value, type.value],
    queryFn: () => fetchData(imdb.value),
    enabled: !!imdb.value,
    gcTime: 0,
    retry: true,
  });

  return {
    ...query
  };
};
