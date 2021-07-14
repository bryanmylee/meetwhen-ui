import type { Interval, IntervalDTO, Schedule, ScheduleDTO, User, UserDTO } from '.';
import type { Identifiable } from './identifiable';

export interface ShallowMeeting extends Identifiable {
  name: string;
  emoji: string;
  color?: string;
  slug: string;
  owner: Partial<User> | null;
  total: Interval;
}

export interface Meeting extends ShallowMeeting {
  intervals: Interval[];
  schedules: Schedule[];
}

export interface ShallowMeetingDTO extends Identifiable {
  name: string;
  emoji: string;
  color?: string;
  slug: string;
  owner: Partial<User> | null;
  total: IntervalDTO;
}

export interface MeetingDTO extends Identifiable {
  name: string;
  emoji: string;
  color?: string;
  slug: string;
  owner: Partial<UserDTO> | null;
  total: IntervalDTO;
  intervals: IntervalDTO[];
  schedules: ScheduleDTO[];
}
