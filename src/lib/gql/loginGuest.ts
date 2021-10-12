import { query } from '$lib/gql';

const LOGIN_GUEST = `
mutation ($username: String!, $password: String!, $meetingId: ID!) {
	loginGuest(data: {username: $username, password: $password, meetingId: $meetingId}) {
		id
		name
		email
		guestOf
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
		email: string;
		guestOf: string;
	};
}

interface LoginGuestReturned {
	id: string;
	name: string;
	email: string;
	guestOf: string;
}

export const loginGuest = async (variables: LoginGuestVars): Promise<LoginGuestReturned> => {
	const { loginGuest } = (await query({
		query: LOGIN_GUEST,
		variables: { ...variables },
	})) as LoginGuestResolved;
	return loginGuest;
};
