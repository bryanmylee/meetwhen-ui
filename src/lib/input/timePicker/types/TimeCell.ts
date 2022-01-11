import type { Dayjs } from 'dayjs';

export interface TimeCell {
	time: Dayjs;
	isStartOfBlock: boolean;
	isEndOfBlock: boolean;
}
