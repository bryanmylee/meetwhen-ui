import dayjs from 'dayjs';
import type { KeyboardReducer } from '$lib/input';
import { dateFromId, dateToId } from './dateIds';

export const datePickerKeyboardReducer: KeyboardReducer<string> = (
	event,
	currentId,
) => {
	switch (event.key) {
		case 'ArrowLeft':
			return goLeft(currentId);
		case 'ArrowRight':
			return goRight(currentId);
		case 'ArrowUp':
			return goUp(currentId);
		case 'ArrowDown':
			return goDown(currentId);
		default:
			return currentId;
	}
};

const goLeft = (currentId: string): string => {
	const today = dayjs().startOf('day');
	const next = dateFromId(currentId).subtract(1, 'day');
	return dateToId(next.isBefore(today) ? today : next);
};

const goRight = (currentId: string): string => {
	return dateToId(dateFromId(currentId).add(1, 'day'));
};

const goUp = (currentId: string): string => {
	const today = dayjs().startOf('day');
	const next = dateFromId(currentId).subtract(7, 'day');
	return dateToId(next.isBefore(today) ? today : next);
};

const goDown = (currentId: string): string => {
	return dateToId(dateFromId(currentId).add(7, 'day'));
};
