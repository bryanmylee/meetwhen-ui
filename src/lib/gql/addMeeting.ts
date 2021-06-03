import { query } from '$lib/gql';
import { Interval, IntervalSerializer, Meeting } from './types';

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

export interface AddMeetingVars {
  name: string;
  intervals: Interval[];
}

interface AddMeetingResolved {
  addMeeting: {
    id: string;
    slug: string;
    owner: {
      id: string;
      name: string;
    };
  };
}

export const addMeeting = async ({ name, intervals }: AddMeetingVars): Promise<Meeting> => {
  const variables = {
    name,
    intervals: intervals.map(IntervalSerializer.serialize),
  };
  const { addMeeting } = (await query({ query: ADD_MEETING, variables })) as AddMeetingResolved;
  return {
    ...addMeeting,
    name,
    intervals,
    schedules: [],
  } as Meeting;
};
