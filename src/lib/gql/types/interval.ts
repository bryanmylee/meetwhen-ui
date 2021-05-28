import type { ExcludeMethods } from '$lib/typings/exclude-methods';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export class Interval {
  beg: Dayjs;
  end: Dayjs;

  constructor(props: ExcludeMethods<Interval>) {
    Object.assign(this, props);
  }

  serialize(): IntervalDTO {
    return {
      beg: this.beg.unix(),
      end: this.end.unix(),
    };
  }

  static deserialize(interval: IntervalDTO): Interval {
    if (interval === null) {
      return null;
    }
    const { beg, end } = interval;
    return new Interval({
      beg: dayjs.unix(beg),
      end: dayjs.unix(end),
    });
  }
}

export interface IntervalDTO {
  beg: number;
  end: number;
}
