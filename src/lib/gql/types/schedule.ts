import type { Identifiable } from './identifiable';
import { Interval, IntervalDTO, IntervalSerializer } from './interval';
import type { Meeting, MeetingDTO } from './meeting';
import { MeetingSerializer } from './meeting';
import type { User, UserDTO } from './user';
import { UserSerializer } from './user';

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
    if (schedule === null) {
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
    if (schedule === null) {
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
