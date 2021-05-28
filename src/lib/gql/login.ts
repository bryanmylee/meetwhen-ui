import { query } from '$lib/gql';
import type { User, UserDTO } from './types/user';

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
  login: Pick<UserDTO, 'id' | 'name' | 'email'>;
}

export const login = async (variables: LoginVars): Promise<Pick<User, 'id' | 'name' | 'email'>> => {
  const { login } = (await query({ query: LOGIN, variables })) as LoginResolved;
  return login;
};
