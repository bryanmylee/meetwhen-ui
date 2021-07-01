import { query } from '.';
import { Interval, IntervalDTO, IntervalSerializer } from './types';

const EDIT_SCHEDULE = `
mutation ($meetingId: ID!, $intervals: [IntervalInput!]!, $token: String!) {
  editGuestSchedule(data: {
    meetingId: $meetingId,
    intervals: $intervals,
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
  editGuestSchedule: {
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
}: EditScheduleVars): Promise<EditScheduleReturned> => {
  const variables = {
    meetingId,
    intervals: intervals.map(IntervalSerializer.serialize),
  };
  const { editGuestSchedule } = (await query({
    query: EDIT_SCHEDULE,
    variables,
  })) as EditScheduleResolved;
  return {
    ...editGuestSchedule,
    intervals: editGuestSchedule.intervals.map(IntervalSerializer.deserialize),
  };
};
