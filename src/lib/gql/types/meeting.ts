import type { Interval, IntervalDTO, Schedule, ScheduleDTO, User, UserDTO } from '.';
import type { Identifiable } from './identifiable';

export interface ShallowMeeting extends Identifiable {
  name: string;
  emoji: string;
  slug: string;
  owner: Partial<User> | null;
}

export interface Meeting extends ShallowMeeting {
  intervals: Interval[];
  schedules: Schedule[];
}

export interface MeetingDTO extends Identifiable {
  name: string;
  slug: string;
  owner: Partial<UserDTO>;
  intervals: IntervalDTO[];
  schedules: ScheduleDTO[];
}
