import type { Identifiable } from './identifiable';
import type { Interval, IntervalDTO } from './interval';
import type { Schedule, ScheduleDTO } from './schedule';
import type { User, UserDTO } from './user';

export interface Meeting extends Identifiable {
  name: string;
  slug: string;
  owner: User;
  intervals: Interval[];
  schedules: Schedule[];
}

export interface MeetingDTO extends Identifiable {
  name: string;
  slug: string;
  owner: UserDTO;
  intervals: IntervalDTO[];
  schedules: ScheduleDTO[];
}
