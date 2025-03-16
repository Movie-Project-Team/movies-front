import { useMutation } from "@tanstack/vue-query";
import { apiReClient } from "~/utils/apiReClient";
import { setCookie } from "~/utils/cookie";
import { useLoadingStore } from "~/stores/loading";

const ENDPOINT = '/auth/register';

interface RegisterPayload {
  email: string;
  password: string;
}
const loginMutationFn = async (payload: RegisterPayload) => {
  const api = apiReClient();
  const response = await api<LoginResponse>(`${ENDPOINT}`, {
    method: 'POST',
    body: payload,
  });
  
  return response;
};

export const useRegister = () => {
  const loading = useLoadingStore();

  const mutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: loginMutationFn,
    onMutate: () => {
      loading.show();
    },
    onSuccess: (dataResponse: LoginResponse) => {
      const { data, token } = dataResponse;
      
      loading.hide();
      if (token) {
        localStorage.setItem("userId", String(data.id));
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      loading.hide();
    },
  });

  return {
    ...mutation,
  };
};
