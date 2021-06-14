import { query } from '.';
import { Interval, IntervalDTO, IntervalSerializer } from './types';

const EDIT_SCHEDULE = `
mutation ($meetingId: ID!, $intervals: [IntervalInput!]!, $token: String) {
  editGuestSchedule(data: {
    meetingId: $meetingId,
    intervals: $intervals,
    token: $token
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
  token: string;
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

export const editGuestSchedule = async ({
  meetingId,
  intervals,
  token,
}: EditScheduleVars): Promise<EditScheduleReturned> => {
  const variables = {
    meetingId,
    intervals: intervals.map(IntervalSerializer.serialize),
    token,
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
