import type { Interval, IntervalDTO, Schedule, ScheduleDTO, User, UserDTO } from '.';
import { IntervalSerializer, ScheduleSerializer, UserSerializer } from '.';
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

export class MeetingSerializer {
  static serialize(meeting: Partial<Meeting>): Partial<MeetingDTO> {
    if (meeting == null) {
      return null;
    }
    return {
      ...meeting,
      owner: UserSerializer.serialize(meeting.owner),
      intervals: meeting.intervals?.map(IntervalSerializer.serialize),
      schedules: meeting.schedules?.map(ScheduleSerializer.serialize),
    };
  }

  static deserialize(meeting: Partial<MeetingDTO>): Partial<Meeting> {
    if (meeting == null) {
      return null;
    }
    return {
      ...meeting,
      owner: UserSerializer.deserialize(meeting.owner),
      intervals: meeting.intervals?.map(IntervalSerializer.deserialize),
      schedules: meeting.schedules?.map(ScheduleSerializer.deserialize),
    };
  }
}
