import { getCookie } from '~/utils/cookie';
import { logout } from '@/utils';

export const apiReClient = () => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl.reBase,
    headers: {
      Authorization: `Bearer ${getCookie('access_token')}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    onRequest({ request, options }) {
      // Bạn có thể thêm logic xử lý request ở đây nếu cần
    },
    
    onResponse({ response }) {
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          throw new Error('Unauthorized. Please log in again.');
        }

        if (response.status === 400) {
          const errorData = response._data || {};
          const errors = errorData.errors || {};

          const errorKeys = Object.keys(errors);

          throw new Error(JSON.stringify(errorKeys));
        }
      }
    },
  });

  return api;
};
