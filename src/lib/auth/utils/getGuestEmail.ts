export const getGuestEmail = (username: string, meetingId: string): string =>
	`${username.replace(/\s+/g, '_')}@${meetingId}.guest`;
