import type { Schedule, ShallowUser } from '$lib/gql/types';
import { Map, Set } from 'immutable';
import { derived, writable } from 'svelte/store';
import { getLocalIntervals } from '../utils/intervals';
import { unionSchedules } from '../utils/schedules';

// Logic for all user schedules and the nested intervals.

export const schedules = writable<Schedule[]>([]);

export const allUsers = derived([schedules], ([$schedules]) =>
  $schedules.map((schedule) => schedule.user)
);

export const getComplimentUsers = derived([allUsers], ([$allUsers]) => (users: ShallowUser[]) => {
  const allUsersSet = Set($allUsers.map((user) => Map(user)));
  const usersSet = Set(users.map((user) => Map(user)));
  const complimentUsers = allUsersSet
    .subtract(usersSet)
    .toArray()
    .map((userMap) => userMap.toObject() as ShallowUser);
  complimentUsers.sort((a, b) => a.name === b.name ? 0 : a.name < b.name ? -1 : 1);
  return complimentUsers;
});

export const intervalsWithUsers = derived([schedules], ([$schedules]) =>
  getLocalIntervals(unionSchedules($schedules))
);

export const maxNumUsersPerInterval = derived([intervalsWithUsers], ([$intervalsWithUsers]) =>
  Math.max(...$intervalsWithUsers.map((interval) => interval.users.length))
);
