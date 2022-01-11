import dayjs from 'dayjs';
import { parseTime } from '$lib/core/utils/parseTime';
import { onDay } from './onDay';

it('adjusts the date of a dayjs object', () => {
	const time = parseTime('08:00');
	const today = dayjs().startOf('day');
	const result = onDay(time, today);
	expect(result).toEqual(dayjs().startOf('day').hour(8));
});
