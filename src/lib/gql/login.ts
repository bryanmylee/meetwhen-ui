import { query } from '$lib/gql';
import type { UserDTO } from './types/user';

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
  login: UserDTO;
}

export const login = async (variables: LoginVars): Promise<UserDTO> => {
  const { login } = (await query({ query: LOGIN, variables })) as LoginResolved;
  return login;
};
