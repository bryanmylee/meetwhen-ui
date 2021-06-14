import { query } from '$lib/gql';

const LOGIN = `
mutation ($username: String!, $password: String!, $meetingId: ID!) {
  loginGuest(data: {username: $username, password: $password, meetingId: $meetingId}) {
    id
    name
    guestOf
    token
  }
}`;

export interface LoginGuestVars {
  meetingId: string;
  username: string;
  password: string;
}

interface LoginGuestResolved {
  loginGuest: {
    id: string;
    name: string;
    guestOf: string;
    token: string;
  };
}

interface LoginGuestReturned {
  id: string;
  name: string;
  guestOf: string;
  token: string;
}

export const loginGuest = async (variables: LoginGuestVars): Promise<LoginGuestReturned> => {
  const { loginGuest } = (await query({
    query: LOGIN,
    variables: { ...variables },
  })) as LoginGuestResolved;
  return loginGuest;
};
