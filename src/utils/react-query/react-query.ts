import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { api, Source } from '@/utils';
import { useSearchParams } from 'react-router-dom';

type AppHeaders = {
  Authorization?: string;
  token?: string;
};
type QueryKeyT = [string, object | undefined];

export const useFetch = <T>(
  source: Source,
  url: string,
  params?: object,
  config?: UseQueryOptions<Promise<T>, Error, T, QueryKeyT>,
  headers?: AppHeaders,
  enabled?: boolean
) => {
  const [searchParams] = useSearchParams();
  const dossierId = searchParams.get('dossier') || '';
  const year = searchParams.get('year') || '';

  return useQuery<Promise<T>, Error, T, QueryKeyT>(
    [url, params],
    async ({ queryKey, pageParam }): Promise<T> => {
      const [url, params] = queryKey;
      const res = await api.get<T>(
        source,
        url,
        {
          params: {
            ...params,
            pageParam,
          },
        },
        {
          ...headers,
          'x-customer-folder-key': dossierId,
          'x-fiscal-years-key': year,
        }
      );
      return res.data;
    },
    {
      enabled: undefined == enabled ? !!url : enabled,
      ...config,
    }
  );
};

export const usePrefetch = <T>(source: Source, url: string, params?: object) => {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.prefetchQuery<T, Error, T, QueryKeyT>(
      [url, params],
      async ({ queryKey, pageParam }): Promise<T> => {
        const [url, params] = queryKey;
        const res = await api.get<T>(source, url, {
          params: {
            ...params,
            pageParam,
          },
        });
        return res.data;
      }
    );
  };
};

const useGenericMutation = <T, S>(
  func: (data: T | S) => Promise<AxiosResponse<S>>,
  url: string,
  params?: object,
  updater?: ((oldData: T, newData: S) => T) | undefined
) => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse, AxiosError, T | S>(func, {
    onMutate: async (data: T | S) => {
      await queryClient.cancelQueries([url, params]);

      const previousData = queryClient.getQueryData([url, params]);

      await queryClient.setQueryData<T>([url, params], (oldData) => {
        return updater ? updater(oldData as T, data as S) : (data as T);
      });

      return previousData;
    },
    onError: async (err, _, context) => {
      await queryClient.setQueryData([url, params], context);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries([url, params]);
    },
  });
};

export const usePost = <T extends S, S>(
  source: Source,
  url: string,
  params?: object,
  updater?: (oldData: T, newData: S) => T,
  headers?: AppHeaders
) => {
  const [searchParams] = useSearchParams();
  const dossierId = searchParams.get('dossier') || '';
  const year = searchParams.get('year') || '';

  return useGenericMutation<T, S>(
    (data) =>
      api.post<S>(source, url, data, {
        ...headers,
        'x-customer-folder-key': dossierId,
        'x-fiscal-years-key': year,
      }),
    url,
    params,
    updater
  );
};

export const useDelete = <T>(
  source: Source,
  url: string,
  params?: object,
  updater?: (oldData: T, id: string | number) => T,
  headers?: AppHeaders
) => {
  const [searchParams] = useSearchParams();
  const dossierId = searchParams.get('dossier') || '';
  const year = searchParams.get('year') || '';

  return useGenericMutation<T, string | number>(
    (id) =>
      api.delete(source, `${url}/${id}`, {
        ...headers,
        'x-customer-folder-key': dossierId,
        'x-fiscal-years-key': year,
      }),
    url,
    params,
    updater
  );
};

export const useUpdate = <T extends S, S>(
  source: Source,
  url: string,
  params?: object,
  updater?: (oldData: T, newData: S) => T,
  headers?: AppHeaders
) => {
  const [searchParams] = useSearchParams();
  const dossierId = searchParams.get('dossier') || '';
  const year = searchParams.get('year') || '';

  return useGenericMutation<T, S>(
    (data) =>
      api.put<S>(source, url, data, {
        ...headers,
        'x-customer-folder-key': dossierId,
        'x-fiscal-years-key': year,
      }),
    url,
    params,
    updater
  );
};
