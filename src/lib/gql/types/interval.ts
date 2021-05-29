import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export interface Interval {
  beg: Dayjs;
  end: Dayjs;
}

export interface IntervalDTO {
  beg: number;
  end: number;
}

export class IntervalSerializer {
  static serialize(interval: Interval): IntervalDTO {
    if (interval === null) {
      return null;
    }
    const { beg, end } = interval;
    return {
      beg: beg.unix(),
      end: end.unix(),
    };
  }

  static deserialize(interval: IntervalDTO): Interval {
    if (interval === null) {
      return null;
    }
    const { beg, end } = interval;
    return {
      beg: dayjs.unix(beg),
      end: dayjs.unix(end),
    };
  }
}
