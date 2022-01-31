import { IntervalConverter } from '$lib/core/types/Interval';
import type { Interval, IntervalData } from '$lib/core/types/Interval';
import type { DocumentData } from 'firebase/firestore';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { definedOnly } from '$lib/core/utils/definedOnly';

export interface Meeting {
	name: string;
	description?: string;
	slug: string;
	created: Dayjs;
	color?: string;
	emoji?: string;
	ownerId?: string;
	links?: string[];
	intervals: Interval[];
}

export interface MeetingData extends DocumentData {
	name: string;
	description?: string;
	slug: string;
	created: number;
	color?: string;
	emoji?: string;
	ownerId?: string;
	links?: string[];
	intervals: IntervalData[];
}

export class MeetingConverter {
	static serialize(meeting: Meeting): MeetingData {
		return definedOnly({
			...meeting,
			created: meeting.created.unix(),
			intervals: meeting.intervals.map(IntervalConverter.serialize),
		});
	}

	static parse(data: MeetingData): Meeting {
		return {
			...data,
			created: dayjs.unix(data.created),
			intervals: data.intervals.map(IntervalConverter.parse),
		};
	}
}
