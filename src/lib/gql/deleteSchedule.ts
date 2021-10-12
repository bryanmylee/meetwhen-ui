import { query } from '$lib/gql';

const DELETE_SCHEDULE = `
mutation ($meetingId: ID!) {
	deleteSchedule(meetingId: $meetingId)
}`;

export interface DeleteScheduleVars {
	meetingId: string;
}

interface DeleteScheduleResolved {
	deleteSchedule: boolean;
}

export const deleteSchedule = async ({ meetingId }: DeleteScheduleVars): Promise<boolean> => {
	const { deleteSchedule } = (await query({
		query: DELETE_SCHEDULE,
		variables: { meetingId },
	})) as DeleteScheduleResolved;
	return deleteSchedule;
};
