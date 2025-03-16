// ~/utils/apiClient.ts
export const apiTmdb = () => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl.tmdb,
    headers: {
      Authorization: `Bearer ${config.public.tmdbApiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    onRequest({ request, options }) {
      options.query = {
        ...options.query,
        language: "vi-VN",
      };
    },
    
    onResponse({ response }) {

    },
  });

  return api;
};
