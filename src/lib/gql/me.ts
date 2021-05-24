import { query } from '$lib/gql';
import type { User } from './types/user';

const ME = `
{
  me {
    id
    name
    email
  }
}`;

interface MeResolved {
  me: User;
}

export const me = async (token?: string): Promise<User> => {
  const { me } = (await query({
    query: ME,
    headers: {
      authorization: `Bearer ${token}`,
    },
  })) as MeResolved;
  return me;
};
