import type Interval from '@my/models/Interval';

export default interface UserTaggedInterval extends Interval {
  users: string[];
}

