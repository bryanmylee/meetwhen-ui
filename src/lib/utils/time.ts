import type { Dayjs } from 'dayjs';

type Unit = 'hour' | 'minute' | 'second';

export class Time {
  private constructor(public unix: number) {}

  get hour(): number {
    return Math.floor(this.unix / 3600);
  }

  get minute(): number {
    return Math.floor(this.unix / 60) % 60;
  }

  get second(): number {
    return this.unix % 60;
  }

  static build(unix: number): Time;
  static build(hour: number, minute: number, second: number): Time;
  static build(...args: [unix: number] | [hour: number, minute: number, second: number]): Time {
    if (args.length === 1) {
      const [unix] = args;
      return new Time(unix);
    }
    const [hour, minute, second] = args;
    return new Time(hour * 3600 + minute * 60 + second);
  }

  static dayjs(dayjs: Dayjs): Time {
    return Time.build(dayjs.hour(), dayjs.minute(), dayjs.second());
  }

  toDayjs(day: Dayjs): Dayjs {
    return day.hour(this.hour).minute(this.minute).second(this.second);
  }

  add(value: number, unit: Unit = 'second'): Time {
    if (unit === 'hour') {
      return Time.build(this.unix + value * 3600);
    }
    if (unit === 'minute') {
      return Time.build(this.unix + value * 60);
    }
    return Time.build(this.unix + value);
  }

  isBeforeDayjs(day: Dayjs): boolean {
    const secondsInDay = day.unix() - day.startOf('day').unix();
    return this.unix < secondsInDay;
  }

  isAfterDayjs(day: Dayjs): boolean {
    const secondsInDay = day.unix() - day.startOf('day').unix();
    return this.unix > secondsInDay;
  }
}

export default Time.build;
