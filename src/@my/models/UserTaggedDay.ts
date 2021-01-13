import type Interval from '@my/models/Interval';
import type TaggedDay from '@my/models/TaggedDay';

export default interface UserTaggedDay extends TaggedDay {
  dayUsers: Record<string, Interval[]>;
}

