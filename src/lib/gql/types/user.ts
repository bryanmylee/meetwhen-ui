import type { ExcludeMethods } from '$lib/typings/exclude-methods';
import type { Identifiable } from './identifiable';
import { Meeting, MeetingDTO } from './meeting';
import { Schedule, ScheduleDTO } from './schedule';

export class User implements Identifiable {
  id: string;
  name: string;
  email: string;
  meetings: Meeting[];
  schedules: Schedule[];

  constructor(props: ExcludeMethods<User>) {
    Object.assign(this, props);
  }

  serialize(): UserDTO {
    return {
      ...this,
      meetings: this.meetings.map((meeting) => meeting.serialize()),
      schedules: this.schedules.map((schedule) => schedule.serialize()),
    };
  }

  static deserialize({ meetings, schedules, ...props }: UserDTO): User {
    return new User({
      ...props,
      meetings: meetings.map(Meeting.deserialize),
      schedules: schedules.map(Schedule.deserialize),
    });
  }
}

export interface UserDTO extends Identifiable {
  name: string;
  email: string;
  meetings: MeetingDTO[];
  schedules: ScheduleDTO[];
}
