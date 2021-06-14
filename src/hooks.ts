import { me } from '$lib/gql/me';
import type { GetSession } from '@sveltejs/kit';
import { parse } from 'cookie';

export const getSession: GetSession = async (request) => {
  const cookies = parse(request.headers.cookie ?? '');
  const sessionId = cookies.__session;

  if (sessionId === undefined) {
    return { user: null };
  }

  try {
    const user = await me(sessionId);
    return { user };
  } catch {
    return { user: null };
  }
};
