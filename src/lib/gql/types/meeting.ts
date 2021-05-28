import type { ExcludeMethods } from '$lib/typings/exclude-methods';
import type { Identifiable } from './identifiable';
import { Interval, IntervalDTO } from './interval';
import { Schedule, ScheduleDTO } from './schedule';
import { User, UserDTO } from './user';

export class Meeting implements Identifiable {
  id: string;
  name: string;
  slug: string;
  owner: User | null;
  intervals: Interval[];
  schedules: Schedule[];

  constructor(props: ExcludeMethods<Meeting>) {
    Object.assign(this, props);
  }

  serialize(): MeetingDTO {
    return {
      ...this,
      owner: this.owner === null ? null : this.owner.serialize(),
      intervals: this.intervals.map((interval) => interval.serialize()),
      schedules: this.schedules.map((schedule) => schedule.serialize()),
    };
  }

  static deserialize({ owner, intervals, schedules, ...props }: MeetingDTO): Meeting {
    return new Meeting({
      ...props,
      owner: owner === null ? null : User.deserialize(owner),
      intervals: intervals.map(Interval.deserialize),
      schedules: schedules.map(Schedule.deserialize),
    });
  }
}

export interface MeetingDTO extends Identifiable {
  name: string;
  slug: string;
  owner: UserDTO;
  intervals: IntervalDTO[];
  schedules: ScheduleDTO[];
}
