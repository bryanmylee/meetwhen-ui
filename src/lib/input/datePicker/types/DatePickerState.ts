import type { Readable } from 'svelte/store';
import type { Dayjs } from 'dayjs';

export interface DatePickerState {
	weekDays: Readable<Dayjs[]>;
	monthDates: Readable<Dayjs[]>;
	disabledDates: Readable<Dayjs[]>;
}
