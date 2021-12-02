import { query } from '$lib/gql';

const SIGNUP_GUEST = `
mutation ($username: String!, $password: String!, $meetingId: String!) {
	addGuestUser(data: {username: $username, password: $password, meetingId: $meetingId}) {
		id
		name
		email
		guestOf
		hasPassword
	}
}`;

export interface SignupGuestVars {
	username: string;
	password?: string;
	meetingId: string;
}

interface SignupGuestResolved {
	addGuestUser: {
		id: string;
		name: string;
		email: string;
		guestOf: string | null;
		hasPassword: boolean;
	};
}

interface SignupGuestReturned {
	id: string;
	name: string;
	email: string;
	guestOf: string | null;
}

export const signupGuest = async (variables: SignupGuestVars): Promise<SignupGuestReturned> => {
	const { addGuestUser } = (await query({
		query: SIGNUP_GUEST,
		variables: { ...variables },
	})) as SignupGuestResolved;
	return addGuestUser;
};
