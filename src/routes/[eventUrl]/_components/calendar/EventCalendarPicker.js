export function getFilteredUserIntervalsByUsername(selectedUsernames, userIntervalsByUsername) {
  if (selectedUsernames.length === 0) return userIntervalsByUsername;
  return Object.keys(userIntervalsByUsername)
    .filter((username) => selectedUsernames.includes(username))
    .reduce((acc, username) => ({
      ...acc,
      [username]: userIntervalsByUsername[username],
    }), {});
}

export function getTimeIntervalsWithSkip(intervals) {
  const results = [];
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

export function getDaysToShowWithSkip(eventIntervalsSplitOnMidnight) {
  const daysWithSkip = [];
  for (const interval of eventIntervalsSplitOnMidnight) {
    const { length } = daysWithSkip;
    const newDay = interval.start.startOf('day');
    if (length === 0) {
      daysWithSkip.push({ day: newDay, skipped: false });
      continue;
    }
    const previousDay = daysWithSkip[length - 1].day;
    if (previousDay.isSame(newDay, 'day')) {
      continue;
    }
    if (previousDay.add(1, 'day').isSame(newDay, 'day')) {
      daysWithSkip.push({ day: newDay, skipped: false });
      continue;
    }
    daysWithSkip.push({ day: newDay, skipped: true });
  }
  return daysWithSkip;
}
