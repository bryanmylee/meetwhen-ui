import { derived } from 'svelte/store';
import type { Writable } from 'svelte/store';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { range } from '$lib/core/utils/range';
import type { DatePickerState } from '../types/DatePickerState';

export const getDatePickerState = (
	focusedDate: Writable<Dayjs>,
): DatePickerState => {
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
	return {
		weekDays,
		monthDates,
		disabledDates,
	};
};
