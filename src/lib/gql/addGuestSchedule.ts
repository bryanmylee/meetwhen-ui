import { query } from '.';
import { Schedule, ScheduleDTO, ScheduleSerializer, UserDTO } from './types';

const ADD_GUEST_SCHEDULE = `
mutation ($username: String!, $password: String!, $meetingId: ID!, $intervals: [IntervalInput!]!) {
  addGuestSchedule(data: {
    username: $username,
    password: $password,
    meetingId: $meetingId,
    intervals: $intervals
  }) {
    id
    user {
      id
      name
      email
    }
    intervals {
      beg
      end
    }
  }
}`;

export type AddGuestScheduleVars = Pick<Schedule, 'intervals'> & {
  username: string;
  password: string;
  meetingId: string;
};

interface AddGuestScheduleResolved {
  addGuestSchedule: Pick<ScheduleDTO, 'intervals'> & {
    user: Pick<UserDTO, 'id' | 'name' | 'email'>;
  };
}

export const addGuestSchedule = async ({
  username,
  password,
  meetingId,
  intervals,
}: AddGuestScheduleVars): Promise<Pick<Schedule, 'user' | 'intervals'>> => {
  const intervalsDTO = ScheduleSerializer.serialize({ intervals });
  const variables = { intervals: intervalsDTO, username, password, meetingId };
  const { addGuestSchedule } = (await query({
    query: ADD_GUEST_SCHEDULE,
    variables,
  })) as AddGuestScheduleResolved;
  // TODO: fix typing of serialize and deserialize
  return ScheduleSerializer.deserialize(addGuestSchedule) as any;
};
