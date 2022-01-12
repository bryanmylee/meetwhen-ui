import { derived, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { range } from '$lib/core/utils/range';

export interface DatePickerProps {
	initDate: Dayjs;
}

export interface DatePickerControls {
	currentDate: Writable<Dayjs>;
}

export interface DatePickerState {
	weekDays: Readable<Dayjs[]>;
	monthDates: Readable<Dayjs[]>;
	disabledDates: Readable<Dayjs[]>;
}

export const createDatePickerState = ({
	initDate,
}: DatePickerProps): [DatePickerControls, DatePickerState] => {
	const currentDate = writable(initDate);
	const weekDays = derived(currentDate, ($currentDate) =>
		range(1, 8).map((day) => $currentDate.day(day)),
	);
	const monthDates = derived(currentDate, ($currentDate) =>
		range(1, $currentDate.daysInMonth() + 1).map((date) =>
			$currentDate.date(date),
		),
	);
	const disabledDates = derived(monthDates, ($monthDates) =>
		$monthDates.filter((date) => date.isBefore(dayjs(), 'date')),
	);
	return [
		{ currentDate },
		{
			weekDays,
			monthDates,
			disabledDates,
		},
	];
};
