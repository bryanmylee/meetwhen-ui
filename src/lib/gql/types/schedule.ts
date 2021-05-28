import type { ExcludeMethods } from '$lib/typings/exclude-methods';
import type { Identifiable } from './identifiable';
import { Interval, IntervalDTO } from './interval';
import { Meeting, MeetingDTO } from './meeting';
import { User, UserDTO } from './user';

export class Schedule implements Identifiable {
  id: string;
  meeting: Meeting;
  user: User;
  intervals: Interval[];

  constructor(props: ExcludeMethods<Schedule>) {
    Object.assign(this, props);
  }

  serialize(): ScheduleDTO {
    return {
      ...this,
      meeting: this.meeting.serialize(),
      user: this.user.serialize(),
      intervals: this.intervals.map((interval) => interval.serialize()),
    };
  }

  static deserialize(schedule: ScheduleDTO): Schedule {
    if (schedule === null) {
      return null;
    }
    const { meeting, user, intervals, ...props } = schedule;
    return new Schedule({
      ...props,
      meeting: Meeting.deserialize(meeting),
      user: User.deserialize(user),
      intervals: intervals.map(Interval.deserialize),
    });
  }
}

export interface ScheduleDTO extends Identifiable {
  meeting: MeetingDTO;
  user: UserDTO;
  intervals: IntervalDTO[];
}
