import { derived, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { range } from '$lib/core/utils/range';

export interface DatePickerProps {
	initDate: Dayjs;
}

export interface DatePickerControls {
	focusedDate: Writable<Dayjs>;
}

export interface DatePickerState {
	weekDays: Readable<Dayjs[]>;
	monthDates: Readable<Dayjs[]>;
	disabledDates: Readable<Dayjs[]>;
}

export const createDatePickerState = ({
	initDate,
}: DatePickerProps): [DatePickerControls, DatePickerState] => {
	const focusedDate = writable(initDate);
	const weekDays = derived(focusedDate, ($focusedDate) =>
		range(1, 8).map((day) => $focusedDate.day(day)),
	);
	const monthDates = derived(focusedDate, ($focusedDate) =>
		range(1, $focusedDate.daysInMonth() + 1).map((date) =>
			$focusedDate.date(date),
		),
	);
	const disabledDates = derived(monthDates, ($monthDates) =>
		$monthDates.filter((date) => date.isBefore(dayjs(), 'date')),
	);
	return [
		{ focusedDate },
		{
			weekDays,
			monthDates,
			disabledDates,
		},
	];
};
