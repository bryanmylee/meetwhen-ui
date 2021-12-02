import { query } from '.';
import type { Interval, IntervalDTO } from './types';
import { IntervalSerializer } from './types';

const ADD_NO_PASS_SCHEDULE = `
mutation ($meetingId: ID!, $userId: ID!, $intervals: [IntervalInput!]!) {
	addNoPassSchedule(data: {
		meetingId: $meetingId,
		userId: $userId,
		intervals: $intervals
	}) {
		user {
			id
			name
			guestOf
			hasPassword
		}
		intervals {
			beg
			end
		}
	}
}`;

export interface AddNoPassScheduleVars {
	intervals: Interval[];
	userId: string;
	meetingId: string;
}

interface AddNoPassScheduleResolved {
	addNoPassSchedule: {
		user: {
			id: string;
			name: string;
			guestOf: string | null;
			hasPassword: boolean;
		};
		intervals: IntervalDTO[];
	};
}

interface AddNoPassScheduleReturned {
	user: {
		id: string;
		name: string;
		guestOf: string | null;
		hasPassword: boolean;
	};
	intervals: Interval[];
}

export const addNoPassSchedule = async ({
	meetingId,
	userId,
	intervals,
}: AddNoPassScheduleVars): Promise<AddNoPassScheduleReturned> => {
	const variables = {
		intervals: intervals.map(IntervalSerializer.serialize),
		meetingId,
		userId,
	};
	const { addNoPassSchedule } = (await query({
		query: ADD_NO_PASS_SCHEDULE,
		variables,
	})) as AddNoPassScheduleResolved;
	return {
		user: addNoPassSchedule.user,
		intervals: addNoPassSchedule.intervals.map(IntervalSerializer.deserialize),
	};
};
