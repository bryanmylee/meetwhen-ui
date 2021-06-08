import type { Meeting, MeetingDTO, Schedule, ScheduleDTO } from '.';
import type { Identifiable } from './identifiable';

export interface ShallowUser extends Identifiable {
  name: string;
  email: string;
  isGuest: boolean;
}

export interface User extends ShallowUser {
  meetings: Partial<Meeting>[];
  schedules: Partial<Schedule>[];
}

export interface UserDTO extends ShallowUser {
  meetings: Partial<MeetingDTO>[];
  schedules: Partial<ScheduleDTO>[];
}
