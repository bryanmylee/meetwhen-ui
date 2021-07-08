import type { Fetch } from '$lib/typings/fetch';
import { isLoadingApi } from '$lib/app-state';

interface QueryClient {
  fetch: Fetch | null;
  endpoint: string;
}

// fetch must be loaded by the root layout component.
export const queryClient: QueryClient = {
  fetch: null,
  endpoint: null,
};

interface QueryParams {
  query: string;
  variables?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export const query = async ({ query, variables, headers }: QueryParams): Promise<unknown> => {
  try {
    isLoadingApi.set(true);
    const response = await queryClient.fetch(queryClient.endpoint, {
      method: 'post',
      credentials: 'include',
      headers: {
        ...headers,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({ query: query.replace(/(\s|\n)+/g, ' '), variables }),
    });
    const { data, errors } = await response.json();
    if (errors !== undefined) {
      throw errors;
    }
    return data;
  } finally {
    isLoadingApi.set(false);
  }
};
