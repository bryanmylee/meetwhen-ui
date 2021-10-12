import type { Interval, IntervalDTO, Meeting, MeetingDTO, User, UserDTO } from '.';
import type { Identifiable } from './identifiable';

export interface Schedule extends Identifiable {
	meeting: Partial<Meeting>;
	user: Partial<User>;
	intervals: Interval[];
}

export interface ScheduleDTO extends Identifiable {
	meeting: Partial<MeetingDTO>;
	user: Partial<UserDTO>;
	intervals: IntervalDTO[];
}
