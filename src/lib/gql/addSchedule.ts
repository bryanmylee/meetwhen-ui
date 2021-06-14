import { query } from '.';
import { Interval, IntervalDTO, IntervalSerializer } from './types';

const ADD_SCHEDULE = `
mutation ($meetingId: ID!, $intervals: [IntervalInput!]!) {
  addSchedule(data: {
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

export interface AddScheduleVars {
  intervals: Interval[];
  meetingId: string;
}

interface AddScheduleResolved {
  addSchedule: {
    user: {
      id: string;
      name: string;
      isGuest: boolean;
    };
    intervals: IntervalDTO[];
  };
}

interface AddScheduleReturned {
  user: {
    id: string;
    name: string;
    isGuest: boolean;
  };
  intervals: Interval[];
}

export const addSchedule = async ({
  meetingId,
  intervals,
}: AddScheduleVars): Promise<AddScheduleReturned> => {
  const variables = {
    intervals: intervals.map(IntervalSerializer.serialize),
    meetingId,
  };
  const { addSchedule } = (await query({
    query: ADD_SCHEDULE,
    variables,
  })) as AddScheduleResolved;
  return {
    ...addSchedule,
    intervals: addSchedule.intervals.map(IntervalSerializer.deserialize),
  };
};
