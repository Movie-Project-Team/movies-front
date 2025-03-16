import { useMutation } from "@tanstack/vue-query";
import { apiReClient } from "~/utils/apiReClient";
import { useLoadingStore } from "~/stores/loading";

const ENDPOINT = '/auth/verify/password';

interface VerifyOtpPayload {
  userId: number,
  otp: string
}

interface VerifyOtpResponse {
  message: string,
}

const loginMutationFn = async (payload: VerifyOtpPayload) => {
  const api = apiReClient();
  const response = await api<VerifyOtpResponse>(`${ENDPOINT}`, {
    method: 'POST',
    body: payload,
  });
  
  return response;
};

export const useVerifyOtp = () => {
  const loading = useLoadingStore();

  const mutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: loginMutationFn,
    onMutate: () => {
      loading.show();
    },
    onSuccess: (data: VerifyOtpResponse) => {
      loading.hide();
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
