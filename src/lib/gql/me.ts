import { query } from '$lib/gql';
import type { UserDTO } from './types/user';

const ME = `
{
  me {
    id
    name
    email
  }
}`;

interface MeResolved {
  me: UserDTO;
}

export const me = async (token?: string): Promise<UserDTO> => {
  const { me } = (await query({
    query: ME,
    headers: {
      authorization: `Bearer ${token}`,
    },
  })) as MeResolved;
  return me;
};
