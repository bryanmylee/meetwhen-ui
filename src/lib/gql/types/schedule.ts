import type { Interval, IntervalDTO, Meeting, MeetingDTO, User, UserDTO } from '.';
import { IntervalSerializer, MeetingSerializer, UserSerializer } from '.';
import type { Identifiable } from './identifiable';

export interface Schedule extends Identifiable {
  meeting: Partial<Meeting>;
  user: Partial<User>;
  intervals: Partial<Interval>[];
}

export interface ScheduleDTO extends Identifiable {
  meeting: Partial<MeetingDTO>;
  user: Partial<UserDTO>;
  intervals: Partial<IntervalDTO>[];
}

export class ScheduleSerializer {
  static serialize(schedule: Partial<Schedule>): Partial<ScheduleDTO> {
    if (schedule == null) {
      return null;
    }
    return {
      ...schedule,
      meeting: MeetingSerializer.serialize(schedule.meeting),
      user: UserSerializer.serialize(schedule.user),
      intervals: schedule.intervals?.map(IntervalSerializer.serialize),
    };
  }

  static deserialize(schedule: Partial<ScheduleDTO>): Partial<Schedule> {
    if (schedule == null) {
      return null;
    }
    return {
      ...schedule,
      meeting: MeetingSerializer.deserialize(schedule.meeting),
      user: UserSerializer.deserialize(schedule.user),
      intervals: schedule.intervals?.map(IntervalSerializer.deserialize),
    };
  }
}
