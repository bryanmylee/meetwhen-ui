import type { Dayjs } from 'dayjs';

export class Time {
  constructor(public unix: number) {}
  get hour(): number {
    return Math.floor(this.unix / 3600);
  }
  get minute(): number {
    return Math.floor(this.unix / 60) % 60;
  }
  get second(): number {
    return this.unix % 60;
  }
}

function init(unix: number): Time;
function init(hour: number, minute: number, second: number): Time;
function init(dayjs: Dayjs): Time;
function init(
  ...args: [unix: number] | [hour: number, minute: number, second: number] | [dayjs: Dayjs]
): Time {
  if (args.length === 1) {
    const [arg] = args;
    if (typeof arg === 'number') {
      const unix = arg;
      return new Time(unix);
    }
    const day = arg;
    return new Time(day.hour() * 3600 + day.minute() * 60 + day.second());
  }
  const [hour, minute, second] = args;
  return new Time(hour * 3600 + minute * 60 + second);
}
export default init;
