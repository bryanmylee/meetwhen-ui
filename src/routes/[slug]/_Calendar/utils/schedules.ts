import type { Interval, Schedule, ShallowUser } from '$lib/gql/types';
import type { Moment } from '$lib/utils/moment';
import dayjs from 'dayjs';
import { Map, Set } from 'immutable';

type UserMap = Map<string, unknown>;

interface ScheduleMoment extends Moment {
  user: UserMap;
}

interface IntervalWithUsersSerial {
  beg: number;
  end: number;
  users: Set<UserMap>;
}

export interface IntervalWithUsers extends Interval {
  users: ShallowUser[];
}

export const unionSchedules = (schedules: Schedule[]): IntervalWithUsers[] => {
  const moments: ScheduleMoment[] = [];
  schedules.forEach(({ user, intervals }) => {
    intervals.forEach(({ beg, end }) => {
      moments.push(
        {
          end: false,
          unix: beg.unix(),
          user: Map(user),
        },
        {
          end: true,
          unix: end.unix(),
          user: Map(user),
        }
      );
    });
  });
  moments.sort((a, b) => {
    if (a.unix === b.unix) {
      // order ending moments first.
      return a.end === true ? -1 : 1;
    }
    return a.unix - b.unix;
  });

  const intervals: IntervalWithUsersSerial[] = [];
  let currentBeg: number = null;
  let currentUsers: Set<UserMap> = Set();
  moments.forEach((moment) => {
    if (moment.end) {
      intervals.push({
        beg: currentBeg,
        end: moment.unix,
        users: currentUsers,
      });
      currentBeg = moment.unix;
      currentUsers = currentUsers.remove(moment.user);
    } else {
      intervals.push({
        beg: currentBeg,
        end: moment.unix,
        users: currentUsers,
      });
      currentBeg = moment.unix;
      currentUsers = currentUsers.add(moment.user);
    }
  });
  const filteredIntervals = intervals.filter(
    ({ beg, end, users }) => beg !== end && users.size > 0
  );
  const renderedIntervals: IntervalWithUsers[] = filteredIntervals.map(({ beg, end, users }) => ({
    beg: dayjs.unix(beg),
    end: dayjs.unix(end),
    users: users.toArray().map((userMap) => userMap.toObject() as ShallowUser),
  }));
  return renderedIntervals;
};
