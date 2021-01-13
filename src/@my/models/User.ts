import type Interval from '@my/models/Interval';

export default interface User {
  eventUrl: string;
  username: string;
  password: string;
  schedule: Interval[];
}

