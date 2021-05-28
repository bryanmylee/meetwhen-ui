import { query } from '$lib/gql';
import { Interval } from './types/interval';
import { Meeting, MeetingDTO } from './types/meeting';
import { Schedule } from './types/schedule';
import { User } from './types/user';

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
        isGuest
      }
      intervals {
        beg
        end
      }
    }
  }
}`;

interface GetMeetingBySlugVars extends Record<string, unknown> {
  slug: string;
}

interface GetMeetingBySlugResolved {
  meeting: MeetingDTO;
}

export const getMeetingBySlug = async (variables: GetMeetingBySlugVars): Promise<Meeting> => {
  const { meeting } = (await query({
    query: GET_MEETING_BY_SLUG,
    variables,
  })) as GetMeetingBySlugResolved;
  const { owner, intervals, schedules, ...props } = meeting;
  return new Meeting({
    ...variables,
    ...props,
    owner: User.deserialize(owner),
    intervals: intervals.map(Interval.deserialize),
    schedules: schedules.map(Schedule.deserialize),
  });
};
