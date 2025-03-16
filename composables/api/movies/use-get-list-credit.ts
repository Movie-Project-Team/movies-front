import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { apiTmdb } from "@/utils/apiTmdb";

const fetchData = async (type: string, tmdb: string): Promise<CreditsTmdbResponse> => {
  const api = apiTmdb();
  const response = await api<CreditsTmdbResponse>(`/${type}/${tmdb}/credits`, {
    method: 'GET',
  });
  return response;
};

export const useGetListCredit = (
  type: Ref<string> = ref(""),
  tmdb: Ref<string> = ref(""),
) => {
  const query = useQuery({
    queryKey: ['credit-list', tmdb.value],
    queryFn: () => fetchData(type.value, tmdb.value),
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
  };
};
