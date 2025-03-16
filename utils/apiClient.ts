// ~/utils/apiClient.ts
import { getCookie } from '~/utils/cookie';
import { logout } from '@/utils';

export const apiClient = () => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl.base,
    headers: {
      Authorization: `Bearer ${getCookie('access_token')}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    onRequest({ request, options }) {

    },
    
    onResponse({ response }) {
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error(`API Error: ${response.statusText}`);
      }
      if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Invalid JSON response');
      }
    },
  });

  return api;
};
