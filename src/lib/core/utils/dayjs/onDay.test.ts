import dayjs from 'dayjs';
import { timeFromId } from '$lib/core/utils/dayjs/timeIds';
import { onDay } from './onDay';

it('adjusts the date of a dayjs object', () => {
	const time = timeFromId('08:00');
	const today = dayjs().startOf('day');
	const result = onDay(time, today);
	expect(result).toEqual(dayjs().startOf('day').hour(8));
});
