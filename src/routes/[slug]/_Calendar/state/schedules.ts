import type { Interval, Schedule, ShallowUser, User } from '$lib/gql/types';
import { Map, Set } from 'immutable';
import type { Readable, Writable } from 'svelte/store';
import { derived, writable } from 'svelte/store';
import { getLocalIntervals } from '../utils/intervals';
import { IntervalWithUsers, unionSchedules } from '../utils/schedules';

// Logic for all user schedules and the nested intervals.
export interface ScheduleState {
  schedules: Writable<Schedule[]>;
  allUsers: Readable<Partial<User>[]>;
  getComplimentUsers: Readable<(users: ShallowUser[]) => ShallowUser[]>;
  intervalsWithUsers: Readable<IntervalWithUsers[]>;
  intervalHasBefore: Readable<(interval: Interval) => boolean>;
  intervalHasAfter: Readable<(interval: Interval) => boolean>;
  maxNumUsersPerInterval: Readable<number>;
}

export const getScheduleState = (): ScheduleState => {
  const schedules = writable<Schedule[]>([]);

  const allUsers = derived([schedules], ([$schedules]) =>
    $schedules.map((schedule) => schedule.user)
  );

  const getComplimentUsers = derived([allUsers], ([$allUsers]) => (users: ShallowUser[]) => {
    const allUsersSet = Set($allUsers.map((user) => Map(user)));
    const usersSet = Set(users.map((user) => Map(user)));
    const complimentUsers = allUsersSet
      .subtract(usersSet)
      .toArray()
      .map((userMap) => userMap.toObject() as ShallowUser);
    complimentUsers.sort((a, b) => (a.name === b.name ? 0 : a.name < b.name ? -1 : 1));
    return complimentUsers;
  });

  const intervalsWithUsers = derived([schedules], ([$schedules]) =>
    getLocalIntervals(unionSchedules($schedules))
  );

  const intervalBegs = derived([intervalsWithUsers], ([$intervalsWithUsers]) =>
    Set($intervalsWithUsers.map((interval) => interval.beg.unix()))
  );

  const intervalEnds = derived([intervalsWithUsers], ([$intervalsWithUsers]) =>
    Set($intervalsWithUsers.map((interval) => interval.end.unix()))
  );

  const intervalHasBefore = derived([intervalEnds], ([$intervalEnds]) => (interval: Interval) =>
    $intervalEnds.includes(interval.beg.unix())
  );

  const intervalHasAfter = derived([intervalBegs], ([$intervalBegs]) => (interval: Interval) =>
    $intervalBegs.includes(interval.end.unix())
  );

  const maxNumUsersPerInterval = derived([intervalsWithUsers], ([$intervalsWithUsers]) =>
    Math.max(...$intervalsWithUsers.map((interval) => interval.users.length))
  );

  return {
    schedules,
    allUsers,
    getComplimentUsers,
    intervalsWithUsers,
    intervalHasBefore,
    intervalHasAfter,
    maxNumUsersPerInterval,
  };
};
