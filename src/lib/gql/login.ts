import { query } from '$lib/gql';
import type { Fetch } from '$lib/typings/fetch';
import type { User } from './types/user';

const LOGIN = `
mutation ($email: String!, $password: String!) {
  login(data: {email: $email, password: $password}) {
    id
    name
    email
  }
}`;

interface LoginVars extends Record<string, unknown> {
  email: string;
  password: string;
}

interface LoginResolved {
  login: User;
}

export const login = async (fetch: Fetch, variables: LoginVars): Promise<User> => {
  const { login } = (await query(fetch, LOGIN, variables)) as LoginResolved;
  return login;
};
