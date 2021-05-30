import dayjs from 'dayjs';
import type {
  Interval,
  IntervalDTO,
  Meeting,
  MeetingDTO,
  Schedule,
  ScheduleDTO,
  User,
  UserDTO,
} from '.';

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

export class IntervalSerializer {
  static serialize(interval: Interval): IntervalDTO {
    if (interval == null) {
      return null;
    }
    const { beg, end } = interval;
    return {
      beg: beg.unix(),
      end: end.unix(),
    };
  }

  static deserialize(interval: IntervalDTO): Interval {
    if (interval == null) {
      return null;
    }
    const { beg, end } = interval;
    return {
      beg: dayjs.unix(beg),
      end: dayjs.unix(end),
    };
  }
}
