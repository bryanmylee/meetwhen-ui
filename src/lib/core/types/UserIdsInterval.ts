import type { Set } from 'immutable';
import type { Interval } from './Interval';

export interface UserIdsInterval extends Interval {
	userIds: Set<string>;
}
