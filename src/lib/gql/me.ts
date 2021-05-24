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

export const me = async (): Promise<User> => {
  const { me } = (await query({ query: ME })) as MeResolved;
  return me;
};
