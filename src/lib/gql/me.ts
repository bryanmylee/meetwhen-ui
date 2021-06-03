import { query } from '$lib/gql';

const ME = `
{
  me {
    id
    name
    email
  }
}`;

interface MeResolved {
  me: {
    id: string;
    name: string;
    email: string;
  };
}

interface MeReturned {
  id: string;
  name: string;
  email: string;
}

export const me = async (token?: string): Promise<MeReturned> => {
  const headers = token === undefined ? {} : { authorization: `Bearer ${token}` };
  const { me } = (await query({ query: ME, headers })) as MeResolved;
  return me;
};
