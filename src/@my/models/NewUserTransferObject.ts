import { fromInterval } from '@my/models/IntervalTransferObject';
import type IntervalTransferObject from '@my/models/IntervalTransferObject';
import type User from '@my/models/User';

export default interface NewUserTransferObject {
  username: string;
  password: string;
  schedule: IntervalTransferObject[];
}

export const fromUser = ({
  username,
  password,
  schedule = [],
}: User): NewUserTransferObject => ({
  username,
  password,
  schedule: schedule.map(fromInterval),
});

