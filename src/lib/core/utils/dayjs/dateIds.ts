import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

export const ID_FORMAT = 'YYYYMMDD';

export const dateToId = (date: Dayjs): string => date.format(ID_FORMAT);

export const dateFromId = (id: string): Dayjs => dayjs(id, ID_FORMAT);
