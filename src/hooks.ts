import type { GetSession } from '@sveltejs/kit';
import type { ShallowUser } from '$lib/gql/types';
import { dev } from '$app/env';
import { me } from '$lib/gql/me';
import { parse } from 'cookie';
import { queryClient } from '$lib/gql';

export const getSession: GetSession = async (request) => {
  queryClient.endpoint = `${dev ? 'http' : 'https'}://${request.host}/api/graphql`;
  queryClient.fetch = fetch;

  const cookies = parse(request.headers.cookie ?? '');
  const user = await getUser(cookies['access-token']);
  return { user };
};

const getUser = async (accessToken: string | undefined): Promise<ShallowUser | null> => {
  if (accessToken === undefined) {
    return null;
  }
  try {
    return await me(accessToken);
  } catch (error) {
    return null;
  }
};
