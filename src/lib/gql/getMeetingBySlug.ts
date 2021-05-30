import { query } from '$lib/gql';
import type { Meeting, MeetingDTO } from './types';
import { MeetingSerializer } from './types';

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

export type GetMeetingBySlugVars = Pick<Meeting, 'slug'>;

type Props = 'id' | 'name' | 'owner' | 'intervals' | 'schedules';

interface GetMeetingBySlugResolved {
  meeting: Pick<MeetingDTO, Props>;
}

export const getMeetingBySlug = async (
  variables: GetMeetingBySlugVars
): Promise<Pick<Meeting, Props>> => {
  const { meeting } = (await query({
    query: GET_MEETING_BY_SLUG,
    variables,
  })) as GetMeetingBySlugResolved;
  return MeetingSerializer.deserialize(meeting) as Pick<Meeting, Props>;
};
