import type { Readable, Writable } from 'svelte/store';
import type { Dayjs } from 'dayjs';

export interface DatePickerState {
	month: Writable<Dayjs>;
	weekDays: Readable<Dayjs[]>;
	monthDates: Readable<Dayjs[]>;
	disabledDates: Readable<Dayjs[]>;
}
