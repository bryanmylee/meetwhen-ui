import { query } from '.';
import { Interval, Schedule, ScheduleSerializer } from './types';

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
      isGuest
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
      isGuest: boolean;
    };
    intervals: {
      beg: number;
      end: number;
    }[];
  };
}

export const addGuestSchedule = async ({
  username,
  password,
  meetingId,
  intervals,
}: AddGuestScheduleVars): Promise<Pick<Schedule, 'user' | 'intervals'>> => {
  const variables = {
    ...ScheduleSerializer.serialize({ intervals }),
    username,
    password,
    meetingId,
  };
  const { addGuestSchedule } = (await query({
    query: ADD_GUEST_SCHEDULE,
    variables,
  })) as AddGuestScheduleResolved;
  // TODO: fix typing of serialize and deserialize
  return ScheduleSerializer.deserialize(addGuestSchedule) as any;
};
