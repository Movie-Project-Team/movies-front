import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { apiReClient } from "~/utils/apiReClient";

const ENDPOINT = '/profile';

const fetchData = async (userId: string): Promise<ProfileReponse> => {
  const api = apiReClient();
  const response = await api<ProfileReponse>(`${ENDPOINT}/${userId}`, {
    method: 'GET',
  });
  return response;
};

export const useGetListProfile = (
  userId: Ref<string> = ref(""),
) => {
  const query = useQuery({
    queryKey: ['profile-list', userId],
    queryFn: () => fetchData(userId.value),
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
  };
};
