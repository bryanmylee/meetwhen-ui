import type { Dayjs } from 'dayjs';

export const onDay = (time: Dayjs, day: Dayjs): Dayjs =>
	day.hour(time.hour()).minute(time.minute()).second(time.second());
