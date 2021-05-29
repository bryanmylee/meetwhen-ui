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

type Props = 'id' | 'name' | 'email';

interface MeResolved {
  me: Pick<UserDTO, Props>;
}

export const me = async (token?: string): Promise<Pick<User, Props>> => {
  const headers = token === undefined ? {} : { authorization: `Bearer ${token}` };
  const { me } = (await query({ query: ME, headers })) as MeResolved;
  return me;
};
