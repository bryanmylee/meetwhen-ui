import type Interval from '@my/models/Interval';

export default interface Event {
  color: string;
  eventUrl: string;
  name: string;
  schedule: Interval[];
  users: Record<string, Interval[]>;
}

