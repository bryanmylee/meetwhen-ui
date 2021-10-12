import { range } from '$lib/utils/range';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export const HOURS = range(0, 24).map((hour) => dayjs().startOf('day').add(hour, 'hour'));
export const toId = (date: Dayjs): string => date?.format('DDHH');
export const toDisplay = (date: Dayjs): string => {
	if (date.isSame(dayjs(), 'day')) {
		return date?.format('ha');
	}
	return `${date?.format('ha')} <span class="text-xs italic">next day</span>`;
};

const sign = (n: number) => (n >= 0 ? '+' : '-');
const padded = (n: number) => `${Math.abs(n)}`.padStart(2, '0');
export const UTCToDisplay = (z: number): string => `UTC ${sign(z)}${padded(z)}`;

export const EARLIEST_OFFSET = -12;
export const LATEST_OFFSET = 14;
export const UTC_OFFSETS = range(EARLIEST_OFFSET, LATEST_OFFSET + 1);
