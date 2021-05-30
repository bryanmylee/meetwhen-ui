import type { Interval, IntervalDTO, Schedule, ScheduleDTO, User, UserDTO } from '.';
import type { Identifiable } from './identifiable';

export interface Meeting extends Identifiable {
  name: string;
  slug: string;
  owner: Partial<User> | null;
  intervals: Interval[];
  schedules: Partial<Schedule>[];
}

export interface MeetingDTO extends Identifiable {
  name: string;
  slug: string;
  owner: Partial<UserDTO>;
  intervals: IntervalDTO[];
  schedules: Partial<ScheduleDTO>[];
}
