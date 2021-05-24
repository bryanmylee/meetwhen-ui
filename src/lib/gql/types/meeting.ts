import type { Identifiable } from './identifiable';
import type { Interval } from './interval';
import type { Schedule } from './schedule';
import type { User } from './user';

export interface Meeting extends Identifiable {
  name: string;
  slug: string;
  owner: User;
  intervals: Interval[];
  schedules: Schedule[];
}
