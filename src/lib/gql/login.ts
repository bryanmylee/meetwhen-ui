import { query } from '$lib/gql';
import type { User, UserDTO } from './types';

const LOGIN = `
mutation ($email: String!, $password: String!) {
  login(data: {email: $email, password: $password}) {
    id
    name
    email
  }
}`;

export type LoginVars = Pick<User, 'email'> & {
  password: string;
};

type Props = 'id' | 'name' | 'email';

interface LoginResolved {
  login: Pick<UserDTO, Props>;
}

export const login = async (variables: LoginVars): Promise<Pick<User, Props>> => {
  const { login } = (await query({ query: LOGIN, variables })) as LoginResolved;
  return login;
};
