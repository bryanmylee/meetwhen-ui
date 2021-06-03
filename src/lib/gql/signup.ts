import { query } from '$lib/gql';

const SIGNUP = `
mutation ($name: String!, $email: String!, $password: String!) {
  addUser(data: {name: $name, email: $email, password: $password}) {
    id
    name
    email
  }
}`;

export interface SignupVars {
  name: string;
  email: string;
  password: string;
}

interface SignupResolved {
  addUser: {
    id: string;
    name: string;
    email: string;
  };
}

interface SignupReturned {
  id: string;
  name: string;
  email: string;
}

export const signup = async (variables: SignupVars): Promise<SignupReturned> => {
  const { addUser } = (await query({
    query: SIGNUP,
    variables: { ...variables },
  })) as SignupResolved;
  return addUser;
};
