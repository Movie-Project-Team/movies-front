import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { apiReClient } from "@/utils/apiReClient";

const ENDPOINT = '/notification';

const fetchData = async (profileId: number): Promise<NotificationResponse> => {
  const api = apiReClient();
  const response = await api<NotificationResponse>(`${ENDPOINT}/${profileId}`, {
    method: 'GET',
  });
  return response;
};

export const useGetListNotification = (
  profileId: Ref<number> = ref(0),
) => {
  const query = useQuery({
    queryKey: ['notification-list', profileId.value],
    queryFn: () => fetchData(profileId.value),
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
  };
};
