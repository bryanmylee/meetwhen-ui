import { IntervalConverter } from '$lib/core/types/Interval';
import type { Interval, IntervalData } from '$lib/core/types/Interval';
import type { DocumentData } from 'firebase/firestore';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { definedOnly } from '$lib/core/utils/definedOnly';
import type { LinkPreviewData } from '$lib/core/types/LinkPreviewData';
import { ScheduleConverter } from './Schedule';
import type { Schedule, ScheduleData } from './Schedule';

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
	schedules?: Schedule[];
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
	schedules?: ScheduleData[];
}

export class MeetingConverter {
	static serialize(meeting: Meeting): MeetingData {
		return definedOnly({
			...meeting,
			created: meeting.created.unix(),
			intervals: meeting.intervals.map(IntervalConverter.serialize),
			total: IntervalConverter.serialize(meeting.total),
			schedules: meeting.schedules?.map(ScheduleConverter.serialize),
		});
	}

	static parse(data: MeetingData): Meeting {
		return definedOnly({
			...data,
			created: dayjs.unix(data.created),
			intervals: data.intervals.map(IntervalConverter.parse),
			total: IntervalConverter.parse(data.total),
			schedules: data.schedules?.map(ScheduleConverter.parse),
		});
	}
}
