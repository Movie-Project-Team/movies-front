import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { apiReClient } from "~/utils/apiReClient";

const ENDPOINT = '/util/genres';

const fetchData = async (): Promise<GenresListResponse> => {
  const api = apiReClient();
  const response = await api<GenresListResponse>(`${ENDPOINT}`, {
    method: 'GET',
  });
  return response;
};

export const useGetListGenres = () => {
  const query = useQuery({
    queryKey: ['genres-list'],
    queryFn: () => fetchData(),
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
  };
};
