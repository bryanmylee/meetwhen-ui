import { query } from '$lib/gql';
import type { User, UserDTO } from './types';

const SIGNUP = `
mutation ($name: String!, $email: String!, $password: String!) {
  addUser(data: {name: $name, email: $email, password: $password}) {
    id
    name
    email
  }
}`;

export type SignupVars = Pick<User, 'name' | 'email'> & {
  password: string;
};

type Props = 'id' | 'name' | 'email';

interface SignupResolved {
  addUser: Pick<UserDTO, Props>;
}

export const signup = async (variables: SignupVars): Promise<Pick<User, Props>> => {
  const { addUser } = (await query({ query: SIGNUP, variables })) as SignupResolved;
  return addUser;
};
