import { query } from '$lib/gql';
import type { Interval } from './types/interval';
import { Meeting, MeetingDTO } from './types/meeting';
import { User } from './types/user';

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

export interface AddMeetingVars extends Record<string, unknown> {
  name: string;
  intervals: Interval[];
}

interface AddMeetingResolved {
  addMeeting: Pick<MeetingDTO, 'id' | 'slug' | 'owner'>;
}

export const addMeeting = async ({ name, intervals }: AddMeetingVars): Promise<Meeting> => {
  const serializedVariables = {
    name,
    intervals: intervals.map((interval) => interval.serialize()),
  };
  const { addMeeting } = (await query({
    query: ADD_MEETING,
    variables: serializedVariables,
  })) as AddMeetingResolved;
  const { owner, ...props } = addMeeting;
  return new Meeting({
    ...props,
    owner: User.deserialize(owner),
    name,
    intervals,
    schedules: [],
  });
};
