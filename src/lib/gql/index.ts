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
}

export const query = async ({ query, variables }: QueryParams): Promise<unknown> => {
  const response = await queryClient.fetch('/api/graphql', {
    method: 'post',
    credentials: 'include',
    headers: {
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
};
