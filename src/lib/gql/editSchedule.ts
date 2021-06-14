import { query } from '.';
import { Interval, IntervalDTO, IntervalSerializer } from './types';

const EDIT_SCHEDULE = `
mutation ($meetingId: ID!, $intervals: [IntervalInput!]!) {
  editSchedule(data: {
    meetingId: $meetingId,
    intervals: $intervals
  }) {
    user {
      id
      name
      guestOf
    }
    intervals {
      beg
      end
    }
  }
}`;

export interface EditScheduleVars {
  intervals: Interval[];
  meetingId: string;
}

interface EditScheduleResolved {
  editSchedule: {
    user: {
      id: string;
      name: string;
      guestOf: string | null;
    };
    intervals: IntervalDTO[];
  };
}

interface EditScheduleReturned {
  user: {
    id: string;
    name: string;
    guestOf: string | null;
  };
  intervals: Interval[];
}

export const editSchedule = async ({
  meetingId,
  intervals,
}: EditScheduleVars): Promise<EditScheduleReturned> => {
  const variables = {
    intervals: intervals.map(IntervalSerializer.serialize),
    meetingId,
  };
  const { editSchedule } = (await query({
    query: EDIT_SCHEDULE,
    variables,
  })) as EditScheduleResolved;
  return {
    ...editSchedule,
    intervals: editSchedule.intervals.map(IntervalSerializer.deserialize),
  };
};
