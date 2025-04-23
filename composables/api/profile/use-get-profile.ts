import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { apiReClient } from "~/utils/apiReClient";

const ENDPOINT = '/profile/info';

const fetchData = async (profileId: string): Promise<ProfileDetailReponse> => {
  const api = apiReClient();
  const response = await api<ProfileDetailReponse>(`${ENDPOINT}/${profileId}`, {
    method: 'GET',
  });
  return response;
};

export const useGetProfile = (
  profileId: Ref<string> = ref(""),
) => {
  const query = useQuery({
    queryKey: ['profile-detail', profileId],
    queryFn: () => fetchData(profileId.value),
    enabled: computed(() => !!profileId.value),
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
  };
};
