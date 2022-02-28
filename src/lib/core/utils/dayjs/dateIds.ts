import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

export const DATE_FORMAT = 'YYYYMMDD';

export const dateToId = (date: Dayjs): string => date.format(DATE_FORMAT);

export const dateFromId = (id: string): Dayjs => dayjs(id, DATE_FORMAT);
