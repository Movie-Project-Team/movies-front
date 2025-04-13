import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { apiReClient } from "@/utils/apiReClient";

const ENDPOINT = '/room';

const fetchData = async (): Promise<RoomListResponse> => {
  const api = apiReClient();
  const response = await api<RoomListResponse>(`${ENDPOINT}`, {
    method: 'GET',
  });
  return response;
};

export const useGetListRoom = () => {
  const query = useQuery({
    queryKey: ['room-list'],
    queryFn: () => fetchData(),
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
  };
};
