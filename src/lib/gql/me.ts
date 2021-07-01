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

export const me = async (): Promise<ShallowUser> => {
  const { me } = (await query({ query: ME })) as MeResolved;
  return me;
};
