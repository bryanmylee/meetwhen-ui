import type { Dayjs } from 'dayjs';

export interface TimeCell {
	time: Dayjs;
	isEndOfBlock: boolean;
}
