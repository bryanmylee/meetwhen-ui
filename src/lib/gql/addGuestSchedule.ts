import { query } from '.';
import { Interval, IntervalDTO, IntervalSerializer } from './types';

const ADD_GUEST_SCHEDULE = `
mutation ($username: String!, $password: String!, $meetingId: ID!, $intervals: [IntervalInput!]!) {
  addGuestSchedule(data: {
    username: $username,
    password: $password,
    meetingId: $meetingId,
    intervals: $intervals
  }) {
    user {
      id
      name
    }
    intervals {
      beg
      end
    }
  }
}`;

export interface AddGuestScheduleVars {
  intervals: Interval[];
  username: string;
  password: string;
  meetingId: string;
}

interface AddGuestScheduleResolved {
  addGuestSchedule: {
    user: {
      id: string;
      name: string;
    };
    intervals: IntervalDTO[];
  };
}

interface AddGuestScheduleReturned {
  user: {
    id: string;
    name: string;
    guestOf: string | null;
  };
  intervals: Interval[];
}

export const addGuestSchedule = async ({
  username,
  password,
  meetingId,
  intervals,
}: AddGuestScheduleVars): Promise<AddGuestScheduleReturned> => {
  const variables = {
    intervals: intervals.map(IntervalSerializer.serialize),
    username,
    password,
    meetingId,
  };
  const { addGuestSchedule } = (await query({
    query: ADD_GUEST_SCHEDULE,
    variables,
  })) as AddGuestScheduleResolved;
  return {
    user: {
      ...addGuestSchedule.user,
      guestOf: meetingId,
    },
    intervals: addGuestSchedule.intervals.map(IntervalSerializer.deserialize),
  };
};
