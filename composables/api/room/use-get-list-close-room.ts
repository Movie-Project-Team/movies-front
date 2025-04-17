import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { apiReClient } from "@/utils/apiReClient";

const ENDPOINT = '/room/close';

const fetchData = async (hostId: any): Promise<RoomListResponse> => {
  const api = apiReClient();
  const response = await api<RoomListResponse>(`${ENDPOINT}/${hostId}`, {
    method: 'GET',
  });
  return response;
};

export const useGetListCloseRoom = (
  hostId: Ref<any> = ref(),
) => {
  const query = useQuery({
    queryKey: ['room-list-close'],
    queryFn: () => fetchData(hostId.value),
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
  };
};
