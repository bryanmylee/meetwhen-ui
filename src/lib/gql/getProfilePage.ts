import { query } from '$lib/gql';
import dayjs from 'dayjs';
import { IntervalSerializer, ShallowMeeting, ShallowMeetingDTO } from './types';

const GET_PROFILE_PAGE = `
query ($timeNow: Int!, $upcomingLimit: Int, $previousLimit: Int) {
	me {
		upcomingMeetings: allMeetings(order: EARLIEST, key: BEG, after: $timeNow, limit: $upcomingLimit) {
			...shallowFields
		}
		previousMeetings: allMeetings(order: EARLIEST, key: BEG, before: $timeNow, limit: $previousLimit) {
			...shallowFields
		}
	}
}

fragment shallowFields on Meeting {
	id
	slug
	name
	emoji
	color
	total {
		beg
		end
	}
}
`;

export interface ProfilePageVariables {
	timeNow?: number;
	upcomingLimit?: number;
	previousLimit?: number;
}

interface ProfilePageResolved {
	me: {
		upcomingMeetings: ShallowMeetingDTO[];
		previousMeetings: ShallowMeetingDTO[];
	};
}

interface ProfilePageReturned {
	upcomingMeetings: ShallowMeeting[];
	previousMeetings: ShallowMeeting[];
}

export const getProfilePage = async ({
	timeNow,
	upcomingLimit,
}: ProfilePageVariables): Promise<ProfilePageReturned> => {
	const { me } = (await query({
		query: GET_PROFILE_PAGE,
		variables: {
			upcomingLimit,
			timeNow: timeNow ?? dayjs().unix(),
		},
	})) as ProfilePageResolved;
	const upcomingMeetings = me.upcomingMeetings.map(({ total, ...meeting }) => ({
		...meeting,
		total: IntervalSerializer.deserialize(total),
	}));
	const previousMeetings = me.previousMeetings.map(({ total, ...meeting }) => ({
		...meeting,
		total: IntervalSerializer.deserialize(total),
	}));
	return {
		upcomingMeetings,
		previousMeetings,
	};
};
