import type { Schedule, User } from '$lib/gql/types';
import type { Moment } from '$lib/utils/moment';

interface ScheduleMoment extends Moment {
  users: Pick<User, 'id' | 'name' | 'email' | 'isGuest'>[];
}

export const unionSchedules = (schedules: Schedule[]) => {
  const moments: ScheduleMoment[] = [];
  schedules.forEach((schedule) => {
    schedule.user.id;
  });
};
