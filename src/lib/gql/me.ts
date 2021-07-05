import { query } from '$lib/gql';
import type { ShallowUser } from './types';

const ME = `
{
  me {
    id
    name
    email
    guestOf
  }
}`;

interface MeResolved {
  me: {
    id: string;
    name: string;
    email: string;
    guestOf: string | null;
  };
}

export const me = async (accessToken: string): Promise<ShallowUser> => {
  const { me } = (await query({
    query: ME,
    headers: {
      cookie: `access-token=${accessToken}`,
    },
  })) as MeResolved;
  return me;
};
