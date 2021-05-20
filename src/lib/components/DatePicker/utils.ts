import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export const toId = (date: Dayjs): string => date?.format('YYYYMMDD');
export const fromId = (id: string): Dayjs => dayjs(id, 'YYYYMMDD');
