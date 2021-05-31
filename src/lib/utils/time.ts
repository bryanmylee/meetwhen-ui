import type { Dayjs } from 'dayjs';

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
    return new Time(dayjs.hour() * 3600 + dayjs.minute() * 60 + dayjs.second());
  }
}

export default Time.build;
