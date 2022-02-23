export const guestEmailInMeeting = (
	email: string,
	meetingId: string,
): boolean => {
	return email.match(new RegExp(`[\\w-_]+@${meetingId}\\.guest`, 'i')) !== null;
};
