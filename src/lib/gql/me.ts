import { query } from '$lib/gql';

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

interface MeReturned {
  id: string;
  name: string;
  email: string;
  guestOf: string | null;
}

export const me = async (token?: string): Promise<MeReturned> => {
  // const headers = token === undefined ? {} : { authorization: `Bearer ${token}` };
  const { me } = (await query({ query: ME })) as MeResolved;
  return me;
};
