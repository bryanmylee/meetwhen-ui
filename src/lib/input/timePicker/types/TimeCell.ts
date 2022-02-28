import type { Dayjs } from 'dayjs';

export interface TimeCell {
	time: Dayjs;
	isStartOfInterval: boolean;
	isEndOfInterval: boolean;
	isEndOfBlock: boolean;
	isEndOfDate: boolean;
}
