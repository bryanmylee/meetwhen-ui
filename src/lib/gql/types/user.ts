import type { Meeting, MeetingDTO, Schedule, ScheduleDTO } from '.';
import { MeetingSerializer, ScheduleSerializer } from '.';
import type { Identifiable } from './identifiable';

export interface User extends Identifiable {
  name: string;
  email: string;
  meetings: Partial<Meeting>[];
  schedules: Partial<Schedule>[];
}

export interface UserDTO extends Identifiable {
  name: string;
  email: string;
  meetings: Partial<MeetingDTO>[];
  schedules: Partial<ScheduleDTO>[];
}

export class UserSerializer {
  static serialize(user: Partial<User>): Partial<UserDTO> {
    if (user == null) {
      return null;
    }
    return {
      ...user,
      meetings: user.meetings?.map(MeetingSerializer.serialize),
      schedules: user.schedules?.map(ScheduleSerializer.serialize),
    };
  }

  static deserialize(user: Partial<UserDTO>): Partial<User> {
    if (user == null) {
      return null;
    }
    return {
      ...user,
      meetings: user.meetings?.map(MeetingSerializer.deserialize),
      schedules: user.schedules?.map(ScheduleSerializer.deserialize),
    };
  }
}
