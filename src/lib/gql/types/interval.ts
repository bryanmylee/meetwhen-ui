import type { Time } from '$lib/utils/time';
import type { Dayjs } from 'dayjs';

export interface Interval {
  beg: Dayjs;
  end: Dayjs;
}

export interface LocalTimeInterval {
  beg: Time;
  end: Time;
}

export interface IntervalDTO {
  beg: number;
  end: number;
}
