import dayjs from 'dayjs';
import type Interval from '@my/models/Interval';

export default interface IntervalTransferObject {
  start: number;
  end: number;
}

export const toInterval = ({ start, end }: IntervalTransferObject): Interval => ({
  from: dayjs(start),
  to: dayjs(end),
});

export const fromInterval = ({ from, to }: Interval): IntervalTransferObject => ({
  start: from.valueOf(),
  end: to.valueOf(),
});

