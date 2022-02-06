import { IntervalConverter } from '$lib/core/types/Interval';
import type { Interval, IntervalData } from '$lib/core/types/Interval';
import type { DocumentData } from 'firebase/firestore';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { definedOnly } from '$lib/core/utils/definedOnly';
import type { Id } from '$lib/core/types/Id';
import type { LinkPreviewData } from '$lib/core/types/LinkPreviewData';
import type { Schedule } from './Schedule';

export interface Meeting {
	name: string;
	description?: string;
	slug: string;
	created: Dayjs;
	color?: string;
	emoji?: string;
	ownerId?: string;
	links?: LinkPreviewData[];
	intervals: Interval[];
	total: Interval;
	// 'schedules' collection reference.
	schedules?: Id<Schedule>[];
}

export interface MeetingData extends DocumentData {
	name: string;
	description?: string;
	slug: string;
	created: number;
	color?: string;
	emoji?: string;
	ownerId?: string;
	links?: LinkPreviewData[];
	intervals: IntervalData[];
	total: IntervalData;
}

export class MeetingConverter {
	static serialize(meeting: Meeting): MeetingData {
		return definedOnly({
			...meeting,
			created: meeting.created.unix(),
			intervals: meeting.intervals.map(IntervalConverter.serialize),
			total: IntervalConverter.serialize(meeting.total),
		});
	}

	static parse(data: MeetingData): Meeting {
		return {
			...data,
			created: dayjs.unix(data.created),
			intervals: data.intervals.map(IntervalConverter.parse),
			total: IntervalConverter.parse(data.total),
		};
	}
}
