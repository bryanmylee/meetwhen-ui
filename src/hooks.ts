import type { GetSession, Request } from '@sveltejs/kit';
import type { ShallowUser } from '$lib/gql/types';
import { dev } from '$app/env';
import { me } from '$lib/gql/me';
import { parse } from 'cookie';
import { queryClient } from '$lib/gql';

export const getSession: GetSession = async (request) => {
  const endpoint = `${dev ? 'http' : 'https'}://${request.host}/api/graphql`;

  queryClient.endpoint = endpoint;
  queryClient.fetch = fetch;

  const user = await getUser(request);
  return { user };
};

const getUser = async (request: Request): Promise<ShallowUser | null> => {
  const cookies = parse(request.headers.cookie ?? '');

  if (cookies['access-token'] === undefined) {
    return null;
  }

  try {
    return await me(cookies['access-token']);
  } catch (error) {
    return null;
  }
};
