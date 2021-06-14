import { query } from '$lib/gql';
import { Interval, IntervalDTO, IntervalSerializer } from './types';

const GET_MEETING_BY_SLUG = `
query ($slug: String!) {
  meeting(slug: $slug) {
    id
    name
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
    owner: {
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
  name: string;
  owner: {
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

export const getMeetingBySlug = async (
  variables: GetMeetingBySlugVars
): Promise<GetMeetingBySlugReturned> => {
  const { meeting } = (await query({
    query: GET_MEETING_BY_SLUG,
    variables: { ...variables },
  })) as GetMeetingBySlugResolved;
  return {
    ...meeting,
    intervals: meeting.intervals.map(IntervalSerializer.deserialize),
    schedules: meeting.schedules.map((schedule) => ({
      ...schedule,
      intervals: schedule.intervals.map(IntervalSerializer.deserialize),
    })),
  };
};
