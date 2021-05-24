import type { Identifiable } from './identifiable';
import type { Interval } from './interval';
import type { Meeting } from './meeting';
import type { User } from './user';

export interface Schedule extends Identifiable {
  meeting: Meeting;
  user: User;
  intervals: Interval[];
}
