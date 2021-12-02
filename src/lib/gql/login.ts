import { query } from '$lib/gql';

const LOGIN = `
mutation ($email: String!, $password: String!) {
	login(data: {email: $email, password: $password}) {
		id
		name
		email
		guestOf
		hasPassword
	}
}`;

export interface LoginVars {
	email: string;
	password: string;
}

interface LoginResolved {
	login: {
		id: string;
		name: string;
		email: string;
		guestOf: string;
		hasPassword: boolean;
	};
}

interface LoginReturned {
	id: string;
	name: string;
	email: string;
	guestOf: string;
	hasPassword: boolean;
}

export const login = async (variables: LoginVars): Promise<LoginReturned> => {
	const { login } = (await query({ query: LOGIN, variables: { ...variables } })) as LoginResolved;
	return login;
};
