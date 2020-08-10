export function getFilteredUserSchedulesByUsername(selectedUsernames, userSchedulesByUsername) {
  if (selectedUsernames.length === 0) return userSchedulesByUsername;
  return Object.keys(userSchedulesByUsername)
    .filter((username) => selectedUsernames.includes(username))
    .reduce((acc, username) => ({
      ...acc,
      [username]: userSchedulesByUsername[username],
    }), {});
}

export function getUserSchedulesWithoutUser(userSchedulesByUsername, userToExclude) {
  if (!userToExclude.isLoggedIn) {
    return userSchedulesByUsername;
  }
  return Object.keys(userSchedulesByUsername)
    .filter((username) => username !== userToExclude.username)
    .reduce((intervals, username) => ({
      ...intervals,
      [username]: userSchedulesByUsername[username],
    }), {});
}

export function getTimeIntervalsWithSkip(intervals) {
  const results = [];
  if (intervals.length === 0) {
    return results;
  }
  let skipped = true;
  let skipping = false;
  for (let i = 0; i < intervals.length - 1; i++) {
    const curr = intervals[i];
    const next = intervals[i + 1];
    skipping = +curr.end !== +next.start;
    results.push({ ...curr, skipped, skipping });
    skipped = skipping;
  }
  results.push({ ...intervals[intervals.length - 1], skipped, skipping: true });
  return results;
}

export function getMinMaxUsernames(userIntervalsByTime) {
  const maxUsernames = userIntervalsByTime.reduce((max, interval) => {
    const { length } = interval.usernames;
    return max >= length ? max : length;
  }, 0);
  const minUsernames = userIntervalsByTime.reduce((min, interval) => {
    const { length } = interval.usernames;
    return min <= length ? min : length;
  }, maxUsernames);
  return [minUsernames, maxUsernames];
}

export function getScheduleWithSkip(schedule) {
  if (schedule.length === 0) {
    return [];
  }
  const scheduleWithSkip = [{
    ...schedule[0],
    skipped: false,
  }];
  schedule.slice(1).forEach((interval, index) => {
    scheduleWithSkip.push({
      ...interval,
      skipped: interval.start.isSame(schedule[index].start, 'day'),
    });
  });
  return scheduleWithSkip;
}
