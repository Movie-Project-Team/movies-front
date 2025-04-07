import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { apiTmdb } from "@/utils/apiTmdb";

const fetchData = async (type: string, tmdb: string): Promise<CreditsTmdbResponse> => {
  const api = apiTmdb();
  const response = await api<CreditsTmdbResponse>(`/${type}/${tmdb}/credits`, {
    method: 'GET',
    cache: "no-store",
  });
  return response;
};

export const useGetListCredit = (
  type: Ref<string> = ref(""),
  tmdb: Ref<string> = ref(""),
) => {
  const isNumericTmdb = computed(() => /^\d+$/.test(tmdb.value));
  
  const query = useQuery({
    queryKey: ['credit-list', tmdb.value],
    queryFn: () => fetchData(type.value, tmdb.value),
    placeholderData: keepPreviousData,
    enabled: computed(() => {
      return type.value === "movie" || (type.value === "tv" && isNumericTmdb.value);
    }),
    staleTime: 0,
    gcTime: 0,
  });

  return {
    ...query,
  };
};
