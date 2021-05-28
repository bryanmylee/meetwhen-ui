import type { Identifiable } from './identifiable';
import type { Meeting, MeetingDTO } from './meeting';
import type { Schedule, ScheduleDTO } from './schedule';

export interface User extends Identifiable {
  name: string;
  email: string;
  meetings: Meeting[];
  schedules: Schedule[];
}

export interface UserDTO extends Identifiable {
  name: string;
  email: string;
  meetings: MeetingDTO[];
  schedules: ScheduleDTO[];
}
