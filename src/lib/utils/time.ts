import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

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

  static dayjs(day: Dayjs): Time {
    return Time.build(day.hour(), day.minute(), day.second());
  }

  onDayjs(day: Dayjs): Dayjs {
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

  format(template?: string): string {
    return this.onDayjs(dayjs()).format(template);
  }
}

export default Time.build;
