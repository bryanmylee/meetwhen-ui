import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

// Each action takes the previous dependent states and returns the updated value.
type Action = ([index, month]: [number, Dayjs]) => [number, Dayjs];

export const keyActions: Record<string, Action> = {
	ArrowRight: ([index, month]) => {
		let newIndex = index + 1;
		if (newIndex < month.daysInMonth()) {
			return [newIndex, month];
		}
		newIndex -= month.daysInMonth();
		return [newIndex, month.add(1, 'month')];
	},
	ArrowDown: ([index, month]) => {
		let newIndex = index + 7;
		if (newIndex < month.daysInMonth()) {
			return [newIndex, month];
		}
		newIndex -= month.daysInMonth();
		return [newIndex, month.add(1, 'month')];
	},
	ArrowLeft: ([index, month]) => {
		if (month.isSame(dayjs(), 'month') && index < dayjs().date()) {
			return [index, month];
		}
		let newIndex = index - 1;
		if (newIndex >= 0) {
			return [newIndex, month];
		}
		const newMonth = month.subtract(1, 'month');
		newIndex += newMonth.daysInMonth();
		return [newIndex, newMonth];
	},
	ArrowUp: ([index, month]) => {
		if (month.isSame(dayjs(), 'month') && index - 6 < dayjs().date()) {
			return [index, month];
		}
		let newIndex = index - 7;
		if (newIndex >= 0) {
			return [newIndex, month];
		}
		const newMonth = month.subtract(1, 'month');
		newIndex += newMonth.daysInMonth();
		return [newIndex, newMonth];
	},
};
