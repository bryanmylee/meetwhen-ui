import { query } from '$lib/gql';

const LOGOUT = `
mutation {
	logout
}`;

interface LogoutResolved {
	logout: boolean;
}

export const logout = async (): Promise<boolean> => {
	const { logout } = (await query({ query: LOGOUT })) as LogoutResolved;
	return logout;
};
