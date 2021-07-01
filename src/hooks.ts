import { me } from '$lib/gql/me';
import type { GetSession } from '@sveltejs/kit';
import { parse } from 'cookie';

export const getSession: GetSession = async (request) => {
  const cookies = parse(request.headers.cookie ?? '');

  if (cookies['access-token'] === undefined) {
    return { user: null };
  }

  try {
    const user = await me();
    return { user };
  } catch {
    return { user: null };
  }
};
