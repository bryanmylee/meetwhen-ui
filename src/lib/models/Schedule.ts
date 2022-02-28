import { IntervalConverter } from '$lib/core/types';
import type { Interval, IntervalData } from '$lib/core/types';
import type { DocumentData } from 'firebase/firestore';
import { definedOnly } from '$lib/core/utils';

export interface Schedule {
	userId: string;
	meetingId: string;
	total: Interval;
	intervals: Interval[];
}

export interface ScheduleData extends DocumentData {
	userId: string;
	meetingId: string;
	total: IntervalData;
	intervals: IntervalData[];
}

export class ScheduleConverter {
	static serialize(schedule: Schedule): ScheduleData {
		return definedOnly({
			...schedule,
			total: IntervalConverter.serialize(schedule.total),
			intervals: schedule.intervals.map(IntervalConverter.serialize),
		});
	}

	static parse(data: ScheduleData): Schedule {
		return {
			...data,
			total: IntervalConverter.parse(data.total),
			intervals: data.intervals.map(IntervalConverter.parse),
		};
	}
}
