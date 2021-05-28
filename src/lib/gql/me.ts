import { query } from '$lib/gql';
import type { User, UserDTO } from './types/user';

const ME = `
{
  me {
    id
    name
    email
  }
}`;

interface MeResolved {
  me: Pick<UserDTO, 'id' | 'name' | 'email'>;
}

export const me = async (token?: string): Promise<Pick<User, 'id' | 'name' | 'email'>> => {
  const { me } = (await query({
    query: ME,
    headers: {
      authorization: `Bearer ${token}`,
    },
  })) as MeResolved;
  return me;
};
