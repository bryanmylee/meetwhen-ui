import { query } from '$lib/gql';
import type { Fetch } from '$lib/typings/fetch';

const LOGOUT = `
mutation {
  logout
}`;

interface LogoutResolved {
  logout: boolean;
}

export const logout = async (fetch: Fetch): Promise<boolean> => {
  const { logout } = (await query(fetch, LOGOUT)) as LogoutResolved;
  return logout;
};
