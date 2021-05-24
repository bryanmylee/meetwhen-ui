import { query } from '$lib/gql';
import type { Fetch } from '$lib/typings/fetch';
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

export const me = async (fetch: Fetch): Promise<User> => {
  const { me } = (await query(fetch, ME)) as MeResolved;
  return me;
};
