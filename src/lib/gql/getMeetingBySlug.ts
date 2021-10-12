import { query } from '$lib/gql';
import { Interval, IntervalDTO, IntervalSerializer } from './types';

const GET_MEETING_BY_SLUG = `
query ($slug: String!) {
  meeting(slug: $slug) {
    id
    name
    emoji
    color
    owner {
      id
      name
    }
    intervals {
      beg
      end
    }
    schedules {
      user {
        id
        name
        guestOf
      }
      intervals {
        beg
        end
      }
    }
  }
}`;

export interface GetMeetingBySlugVars {
	slug: string;
}

interface GetMeetingBySlugResolved {
	meeting: {
		id: string;
		name: string;
		emoji: string;
		color: string;
		owner: null | {
			id: string;
			name: string;
		};
		intervals: IntervalDTO[];
		schedules: {
			user: {
				id: string;
				name: string;
				guestOf: string | null;
			};
			intervals: IntervalDTO[];
		}[];
	};
}

interface GetMeetingBySlugReturned {
	id: string;
	slug: string;
	name: string;
	emoji: string;
	color: string;
	owner: null | {
		id: string;
		name: string;
	};
	intervals: Interval[];
	schedules: {
		user: {
			id: string;
			name: string;
			guestOf: string | null;
		};
		intervals: Interval[];
	}[];
}

export const getMeetingBySlug = async ({
	slug,
}: GetMeetingBySlugVars): Promise<GetMeetingBySlugReturned> => {
	const { meeting } = (await query({
		query: GET_MEETING_BY_SLUG,
		variables: { slug },
	})) as GetMeetingBySlugResolved;
	return {
		...meeting,
		slug,
		intervals: meeting.intervals.map(IntervalSerializer.deserialize),
		schedules: meeting.schedules.map((schedule) => ({
			...schedule,
			intervals: schedule.intervals.map(IntervalSerializer.deserialize),
		})),
	};
};
