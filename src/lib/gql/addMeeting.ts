import { query } from '$lib/gql';
import type { Meeting, MeetingDTO } from './types/meeting';
import { MeetingSerializer } from './types/meeting';

const ADD_MEETING = `
mutation ($name: String!, $intervals: [IntervalInput!]!) {
  addMeeting(data: {name: $name, intervals: $intervals}) {
    id
    slug
    owner {
      id
      name
    }
  }
}`;

export type AddMeetingVars = Pick<Meeting, 'name' | 'intervals'>;

type Props = 'id' | 'slug' | 'owner';

interface AddMeetingResolved {
  addMeeting: Pick<MeetingDTO, Props>;
}

export const addMeeting = async ({
  name,
  intervals,
}: AddMeetingVars): Promise<Pick<Meeting, Props>> => {
  const { addMeeting } = (await query({
    query: ADD_MEETING,
    variables: MeetingSerializer.serialize({ name, intervals }),
  })) as AddMeetingResolved;
  return MeetingSerializer.deserialize(addMeeting) as Pick<Meeting, Props>;
};
