import type { Identifiable } from './identifiable';
import type { Interval, IntervalDTO } from './interval';
import type { Meeting, MeetingDTO } from './meeting';
import type { User, UserDTO } from './user';

export interface Schedule extends Identifiable {
  meeting: Meeting;
  user: User;
  intervals: Interval[];
}

export interface ScheduleDTO extends Identifiable {
  meeting: MeetingDTO;
  user: UserDTO;
  intervals: IntervalDTO[];
}
