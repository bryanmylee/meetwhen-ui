import { query } from '$lib/gql';
import type { Meeting } from './types/meeting';

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
  meeting: Meeting;
}

export const getMeetingBySlug = async (variables: GetMeetingBySlugVars): Promise<Meeting> => {
  const { meeting } = (await query({
    query: GET_MEETING_BY_SLUG,
    variables,
  })) as GetMeetingBySlugResolved;
  return {
    ...meeting,
    ...variables,
  };
};
