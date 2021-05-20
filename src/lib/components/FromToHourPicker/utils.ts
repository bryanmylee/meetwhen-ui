import { range } from '$lib/utils/range';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export const HOURS = range(0, 25).map((hour) => dayjs().startOf('day').add(hour, 'hour'));
export const toId = (date: Dayjs): string => date?.format('DDHH');
export const toDisplay = (date: Dayjs): string => date?.format('ha');

const sign = (n: number) => (n >= 0 ? '+' : '-');
const padded = (n: number) => `${Math.abs(n)}`.padStart(2, '0');
export const utcOffsetsToDisplay = (z: number): string => `${sign(z)}${padded(z)}`;

export const EARLIEST_OFFSET = -12;
export const LATEST_OFFSET = 14;
export const UTC_OFFSETS = range(EARLIEST_OFFSET, LATEST_OFFSET + 1);
