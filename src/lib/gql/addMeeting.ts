import { query } from '$lib/gql';
import type { IntervalDTO } from './types/interval';
import type { MeetingDTO } from './types/meeting';

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
  intervals: IntervalDTO[];
}

interface AddMeetingResolved {
  addMeeting: Omit<MeetingDTO, 'intervals'>;
}

export const addMeeting = async (variables: AddMeetingVars): Promise<MeetingDTO> => {
  const { addMeeting } = (await query({ query: ADD_MEETING, variables })) as AddMeetingResolved;
  return {
    ...addMeeting,
    ...variables,
    schedules: [],
  };
};
