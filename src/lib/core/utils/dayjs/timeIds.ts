import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { Dayjs } from 'dayjs';
dayjs.extend(customParseFormat);

export const timeToId = (time: Dayjs): string => time.format('HH:mm');
export const timeFromId = (id: string): Dayjs => dayjs(id, 'HH:mm');
