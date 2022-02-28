import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { DATE_FORMAT } from './dateIds';
import { TIME_FORMAT } from './timeIds';

export const DATETIME_FORMAT = `${DATE_FORMAT}T${TIME_FORMAT}`;

export const dateTimeToId = (dateTime: Dayjs): string =>
	dateTime.format(DATETIME_FORMAT);

export const dateTimeFromId = (id: string): Dayjs => dayjs(id, DATETIME_FORMAT);

export const dateTimeComposeId = ([dateId, timeId]: [string, string]): string =>
	`${dateId}T${timeId}`;

export const dateTimeDecomposeId = (
	id: string,
): [dateId: string, timeId: string] => id.split('T') as [string, string];
