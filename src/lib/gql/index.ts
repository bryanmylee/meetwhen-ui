import { env } from '$lib/env';
import type { Fetch } from '$lib/typings/fetch';

interface QueryClient {
  fetch: Fetch;
}

// fetch must be loaded by the root layout component.
export const queryClient: QueryClient = {
  fetch: null,
};

interface QueryParams {
  query: string;
  variables?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export const query = async ({ query, variables, headers }: QueryParams): Promise<unknown> => {
  const res = await queryClient.fetch(env.apiGraphQLEndpoint, {
    method: 'post',
    credentials: 'include',
    headers: {
      ...headers,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({ query: query.replace(/(\s|\n)+/g, ' '), variables }),
  });
  const { data, errors } = await res.json();
  if (errors !== undefined) {
    throw errors;
  }
  return data;
};
