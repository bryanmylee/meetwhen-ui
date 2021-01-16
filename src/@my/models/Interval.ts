import type { Dayjs } from 'dayjs';

export default interface Interval {
  from: Dayjs;
  to: Dayjs;
}

export const getKey = ({ from, to }: Interval) => from.format('HHmm') + to.format('HHmm');

export const isMultiDay = ({ from, to }: Interval) => !from.isSame(to, 'day');

export const midnightSplit = (interval: Interval) => {
  if (!isMultiDay(interval)) return [interval];
  const { from, to } = interval;
  const midnight = from.endOf('day');
  return [{ from, to: midnight }, { from: midnight, to }];
};

