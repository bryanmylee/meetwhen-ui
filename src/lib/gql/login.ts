import { query } from '$lib/gql';
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

export const login = async (variables: LoginVars): Promise<User> => {
  const { login } = (await query(LOGIN, variables)) as LoginResolved;
  return login;
};
