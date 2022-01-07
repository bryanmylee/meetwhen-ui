import { derived, writable } from 'svelte/store';
import dayjs from 'dayjs';
import { range } from '$lib/core/utils/range';
import type { DatePickerState } from '../types/DatePickerState';

export const getDatePickerState = (): DatePickerState => {
	const month = writable(dayjs().startOf('month').startOf('day'));
	const weekDays = derived(month, ($month) =>
		range(1, 8).map((day) => $month.day(day)),
	);
	const monthDates = derived(month, ($month) =>
		range(1, $month.daysInMonth() + 1).map((date) => $month.date(date)),
	);
	const disabledDates = derived(monthDates, ($monthDates) =>
		$monthDates.filter((date) => date.isBefore(dayjs(), 'date')),
	);
	return {
		month,
		weekDays,
		monthDates,
		disabledDates,
	};
};
