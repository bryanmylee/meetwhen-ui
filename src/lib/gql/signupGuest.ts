import { query } from '$lib/gql';

const SIGNUP_GUEST = `
mutation ($username: String!, $password: String!, $meetingId: String!) {
  addGuestUser(data: {name: $name, email: $email, password: $password}) {
    id
    name
    email
  }
}`;

export interface SignupGuestVars {
  username: string;
  password: string;
  meetingId: string;
}

interface SignupGuestResolved {
  addGuestUser: {
    id: string;
    name: string;
    email: string;
  };
}

interface SignupGuestReturned {
  id: string;
  name: string;
  email: string;
}

export const signupGuest = async (variables: SignupGuestVars): Promise<SignupGuestReturned> => {
  const { addGuestUser } = (await query({
    query: SIGNUP_GUEST,
    variables: { ...variables },
  })) as SignupGuestResolved;
  return addGuestUser;
};
