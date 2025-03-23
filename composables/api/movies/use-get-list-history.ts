import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { apiReClient } from "@/utils/apiReClient";

const ENDPOINT = '/profile';

const fetchData = async (profileId: number): Promise<WatchHistoryResponse> => {
  const api = apiReClient();
  const response = await api<WatchHistoryResponse>(`${ENDPOINT}/${profileId}/history`, {
    method: 'GET',
  });
  return response;
};

export const useGetListHistory = (
  profileId: Ref<number> = ref(0),
) => {
  const query = useQuery({
    queryKey: ['history-list', profileId.value],
    queryFn: () => fetchData(profileId.value),
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
  };
};
