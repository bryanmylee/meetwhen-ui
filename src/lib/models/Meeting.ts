import { IntervalConverter } from '$lib/core/types/Interval';
import type { Interval, IntervalData } from '$lib/core/types/Interval';
import type { DocumentData } from 'firebase/firestore';

export interface Meeting {
	color?: string;
	emoji?: string;
	intervals: Interval[];
	name: string;
	slug: string;
	total: Interval;
}

export interface MeetingData extends DocumentData {
	color?: string;
	emoji?: string;
	intervals: IntervalData[];
	name: string;
	slug: string;
	total: IntervalData;
}

export class MeetingConverter {
	static serialize(meeting: Meeting): MeetingData {
		return {
			...meeting,
			intervals: meeting.intervals.map(IntervalConverter.serialize),
			total: IntervalConverter.serialize(meeting.total),
		};
	}

	static parse(data: MeetingData): Meeting {
		return {
			...data,
			intervals: data.intervals.map(IntervalConverter.parse),
			total: IntervalConverter.parse(data.total),
		};
	}
}
