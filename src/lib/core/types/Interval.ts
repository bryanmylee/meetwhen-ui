import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { DocumentData } from 'firebase/firestore';

export interface Interval {
	start: Dayjs;
	end: Dayjs;
}

export interface IntervalData extends DocumentData {
	beg: number;
	end: number;
}

export class IntervalConverter {
	static serialize(interval: Interval): IntervalData {
		return {
			beg: interval.start.unix(),
			end: interval.end.unix(),
		};
	}

	static parse(data: IntervalData): Interval {
		return {
			start: dayjs.unix(data.beg),
			end: dayjs.unix(data.end),
		};
	}
}
