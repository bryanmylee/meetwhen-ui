import { query } from '$lib/gql';
import type { Interval } from './types/interval';
import type { Meeting } from './types/meeting';

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
  addMeeting: Omit<Meeting, 'intervals'>;
}

export const addMeeting = async (variables: AddMeetingVars): Promise<Meeting> => {
  const { addMeeting } = (await query({ query: ADD_MEETING, variables })) as AddMeetingResolved;
  return {
    ...addMeeting,
    ...variables,
    schedules: [],
  };
};
