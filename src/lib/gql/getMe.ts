import { query } from '$lib/gql';
import type { ShallowUser } from './types';

const GET_ME = `
{
  me {
    id
    name
    email
    guestOf
  }
}`;

interface MeResolved {
  me: ShallowUser;
}

export const getMe = async (accessToken: string): Promise<ShallowUser> => {
  const { me } = (await query({
    query: GET_ME,
    headers: {
      cookie: `access-token=${accessToken}`,
    },
  })) as MeResolved;
  return me;
};
