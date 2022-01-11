import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { Dayjs } from 'dayjs';
dayjs.extend(customParseFormat);

export const TIME_FORMAT = 'HH:mm';

export const timeToId = (time: Dayjs): string => time.format(TIME_FORMAT);
export const timeFromId = (id: string): Dayjs => dayjs(id, TIME_FORMAT);
