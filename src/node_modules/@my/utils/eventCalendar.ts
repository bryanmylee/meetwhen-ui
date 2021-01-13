import dayjs from 'dayjs';
import flat from '@my/utils/flat';
import range from '@my/utils/range';
import { midnightSplit } from '@my/models/Interval';
import type { Dayjs } from 'dayjs';
import type Interval from '@my/models/Interval';
import type TaggedDay from '@my/models/TaggedDay';
import type TimeTaggedDay from '@my/models/TimeTaggedDay';
import type UserTaggedInterval from '@my/models/UserTaggedInterval';
import type UserTaggedDay from '@my/models/UserTaggedDay';

export const getHours = (schedule: Interval[]) => {
  if (schedule == null || schedule.length === 0) {
    return [];
  }
  const { from, to } = schedule[0];
  const count = to.diff(from, 'hour');
  return range(0, count).map(h => from.add(h, 'hour'));
};

export const getDays = (schedule: Interval[]) => {
  if (schedule == null || schedule.length === 0) {
    return [];
  }
  return schedule
      .map(interval => interval.from.startOf('day'))
      .sort((a, b) => a.unix() - b.unix());
};

export const getScheduleFromHalfHours = (halfHours: Dayjs[]) => {
  if (halfHours == null || halfHours.length === 0) {
    return [];
  }
  const schedule: Interval[] = [];
  let currentInterval: Interval = null;
  halfHours.sort((a, b) => a.unix() - b.unix());
  halfHours.forEach(hh => {
    if (currentInterval == null) {
      currentInterval = { from: hh, to: hh.add(30, 'minute') };
    } else if (currentInterval.to.isSame(hh)) {
      currentInterval = { ...currentInterval, to: hh.add(30, 'minute') };
    } else {
      schedule.push(currentInterval);
      currentInterval = { from: hh, to: hh.add(30, 'minute') };
    }
  });
  schedule.push(currentInterval);
  return schedule;
};

export const getUserTaggedDays = (users: Record<string, Interval[]>): UserTaggedDay[] => {
  if (users == null) return [];
  const usersByDay: Record<string, Record<string, Interval[]>> = {};
  Object.entries(users).forEach(([name, schedule]) => {
    const intervals = flat(schedule.map(midnightSplit));
    intervals.forEach(interval => {
      const day = interval.from.startOf('day').format('YYYYMMDD');
      if (usersByDay[day] == null) {
        usersByDay[day] = {};
      }
      const users = usersByDay[day];
      if (users[name] == null) {
        users[name] = [];
      }
      const schedule = users[name];
      schedule.push(interval);
    });
  });
  return Object.entries(usersByDay).map(([dayId, usersInDay]) => ({
    day: dayjs(dayId, 'YYYYMMDD'),
    dayUsers: usersInDay,
  }));
};

export const getTimeTaggedDays = (times: Dayjs[]): TimeTaggedDay[] => {
  if (times == null) return [];
  const timesByDay: Record<string, Dayjs[]> = {};
  times.forEach(time => {
    const dayKey = time.startOf('day').format('YYYYMMDD');
    if (timesByDay[dayKey] == null) {
      timesByDay[dayKey] = [];
    }
    timesByDay[dayKey].push(time);
  });
  return Object.entries(timesByDay).map(([dayId, timesInDay]) => ({
    day: dayjs(dayId, 'YYYYMMDD'),
    dayTimes: timesInDay,
  }));
}

export const extendedTaggedDays = <B extends TaggedDay, E extends TaggedDay>(base: B[], ...extensions: E[][]) => {
  const extendedBase = [...base] as (B & Partial<E>)[];
  extendedBase.sort((a, b) => a.day.unix() - b.day.unix());
  extensions.forEach(extension => {
    const ex = [...extension];
    ex.sort((a, b) => a.day.unix() - b.day.unix());
    let bIndex = 0;
    let eIndex = 0;
    while (bIndex < extendedBase.length && eIndex < ex.length) {
      if (extendedBase[bIndex].day.isSame(ex[eIndex].day, 'day')) {
        extendedBase[bIndex] = { ...ex[eIndex], ...extendedBase[bIndex] };
        eIndex++;
      }
      bIndex++;
    }
  })
  return extendedBase;
}

interface Action {
  time: Dayjs;
  adding: boolean;
  user: string;
}

const getActions = (users: Record<string, Interval[]>) => {
  if (users == null) return [];
  const nestedEntries = Object.entries(users)
      .map(([name, schedule]) => schedule.map(interval => [name, interval] as [string, Interval]));
  const entries = flat(nestedEntries);
  const nestedActions: Action[][] = entries.map(([name, interval]) => [{
    time: interval.from,
    adding: true,
    user: name
  }, {
    time: interval.to,
    adding: false,
    user: name
  }]);
  return flat(nestedActions).sort((a, b) => a.time.unix() - b.time.unix());
}

export const getUserTaggedIntervals = (users: Record<string, Interval[]>): UserTaggedInterval[] => {
  const actions = getActions(users);
  const userTaggedIntervals: UserTaggedInterval[] = [];
  let currentInterval: UserTaggedInterval = null;
  let currentUsers: Set<string> = new Set();
  actions.forEach(({ time, adding, user }) => {
    if (currentInterval == null) {
      currentUsers.add(user);
      currentInterval = { from: time, to: null, users: [...currentUsers] };
      return;
    }
    if (time.isSame(currentInterval.from)) {
      currentUsers.add(user);
      currentInterval.users = [...currentUsers];
      return;
    }
    currentInterval.to = time;
    userTaggedIntervals.push(currentInterval);
    if (adding) {
      currentUsers.add(user);
    } else {
      currentUsers.delete(user);
    }
    currentInterval = { from: time, to: null, users: [...currentUsers] };
  });
  return userTaggedIntervals;
};

export const getPercentage = (at: Dayjs, hours: Dayjs[]) => {
  if (hours.length == 0) return 0;
  const firstHour = hours[0];
  const lastHour = hours[hours.length - 1];
  const totalHourDiff = lastHour.diff(firstHour, 'hour') + 1;
  const dayDiff = firstHour.startOf('day').diff(at.startOf('day'), 'day');
  const atHourDiff = at.add(dayDiff, 'day').diff(firstHour, 'minute') / 60;
  return atHourDiff / totalHourDiff * 100;
};

export const getTop = (from: Dayjs, hours: Dayjs[]) => getPercentage(from, hours);

export const getHeight = (from: Dayjs, to: Dayjs, hours: Dayjs[]) => {
  return getPercentage(to, hours) - getPercentage(from, hours);
};

export const hasTopInterval = (center: UserTaggedInterval, schedule: UserTaggedInterval[]) => {
  const { from, users: centerUsers } = center;
  return schedule.some(({ to, users }) => to.isSame(from) && users.length !== centerUsers.length);
};

export const hasBottomInterval = (center: UserTaggedInterval, schedule: UserTaggedInterval[]) => {
  const { to, users: centerUsers } = center;
  return schedule.some(({ from, users }) => from.isSame(to) && users.length !== centerUsers.length);
};

export const hasTopHalfHour = (center: Dayjs, others: Dayjs[]) => {
  return others.some(o => o.isSame(center.subtract(30, 'minute')));
};

export const hasBottomHalfHour = (center: Dayjs, others: Dayjs[]) => {
  return others.some(o => o.isSame(center.add(30, 'minute')));
};

