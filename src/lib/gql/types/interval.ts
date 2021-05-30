import type { Dayjs } from 'dayjs';

export interface Interval {
  beg: Dayjs;
  end: Dayjs;
}

export interface IntervalDTO {
  beg: number;
  end: number;
}
