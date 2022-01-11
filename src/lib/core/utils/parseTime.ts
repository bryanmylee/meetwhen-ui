import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { Dayjs } from 'dayjs';
dayjs.extend(customParseFormat);

export const parseTime = (time: string): Dayjs => dayjs(time, 'HH:mm');
