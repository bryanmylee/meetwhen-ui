import { env } from '$lib/env';
import type { Fetch } from '$lib/typings/fetch';

export const query = async (
  fetch: Fetch,
  query: string,
  variables?: Record<string, unknown>
): Promise<unknown> => {
  const res = await fetch(env.apiGraphQLEndpoint, {
    method: 'post',
    credentials: 'same-origin',
    headers: {
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
