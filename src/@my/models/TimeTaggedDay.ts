import type { Dayjs } from 'dayjs';
import type TaggedDay from '@my/models/TaggedDay';

export default interface TimeTaggedDay extends TaggedDay {
  dayTimes: Dayjs[];
}

