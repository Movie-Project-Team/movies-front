import { useMutation } from "@tanstack/vue-query";
import { apiReClient } from "~/utils/apiReClient";
import { setCookie } from "~/utils/cookie";
import { useLoadingStore } from "~/stores/loading";

const ENDPOINT = '/auth/login';

interface LoginPayload {
  email: string;
  password: string;
}
const loginMutationFn = async (payload: LoginPayload) => {
  const api = apiReClient();
  const response = await api<LoginResponse>(`${ENDPOINT}`, {
    method: 'POST',
    body: payload,
  });
  
  return response;
};

export const useLogin = () => {
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
        setCookie('access_token', token);
        localStorage.setItem("userId", String(data.id));
        localStorage.setItem("isActive", String(data.is_active));
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
