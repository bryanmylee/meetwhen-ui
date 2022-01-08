import type { Dayjs } from 'dayjs';
import type { KeyboardReducer } from '$lib/input';

export const datePickerKeyboardReducer: KeyboardReducer<Dayjs> = (
	event,
	current,
) => {
	switch (event.key) {
		case 'ArrowLeft':
			return goLeft(current);
		case 'ArrowRight':
			return goRight(current);
		case 'ArrowUp':
			return goUp(current);
		case 'ArrowDown':
			return goDown(current);
		default:
			return current;
	}
};

const goLeft = (current: Dayjs): Dayjs => current.subtract(1, 'day');
const goRight = (current: Dayjs): Dayjs => current.add(1, 'day');
const goUp = (current: Dayjs): Dayjs => current.subtract(7, 'days');
const goDown = (current: Dayjs): Dayjs => current.add(7, 'days');
