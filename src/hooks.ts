import { me } from '$lib/gql/me';
import type { GetSession } from '@sveltejs/kit';
import { parse } from 'cookie';

export const getSession: GetSession = async (request) => {
  const cookies = parse(request.headers.cookie ?? '');

  if (cookies['access-token'] === undefined) {
    return { user: null, guestUser: null };
  }

  try {
    const user = await me();
    if (user.guestOf !== null) {
      return { user: null, guestUser: user };
    }
    return { user: user, guestUser: null };
  } catch {
    return { user: null, guestUser: null };
  }
};
