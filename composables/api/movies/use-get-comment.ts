import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { apiReClient } from "@/utils/apiReClient";

const ENDPOINT = 'comment';
const fetchData = async (movieId: number): Promise<CommentListResponse> => {
  const api = apiReClient();
  const response = await api<CommentListResponse>(`/${ENDPOINT}/${movieId}`, {
    method: 'GET',
  });
  
  return response;
};

export const useGetComment = (
  movieId: Ref<number> = ref(0),
) => {
  const query = useQuery({
    queryKey: ['comment-list', movieId.value],
    queryFn: () => fetchData(movieId.value),
    placeholderData: keepPreviousData,
    enabled: !!movieId.value,
  });

  return {
    ...query,
  };
};
