/**
 * This deals with any representations of time intervals of an event.
 */
/**
 * @typedef {{start: dayjs.Dayjs, end: dayjs.Dayjs}} interval
 * @typedef {{time: dayjs.Dayjs, isAdd: boolean, username: string}} action
 * @typedef {{time: dayjs.Dayjs, isAdd: boolean, usernames: string[]}} multiUserAction
 */

/**
 * It is possible that the event intervals span multiple days due to different
 * timezones. Split those intervals across the midnight boundary to display
 * properly on the client.
 * @param {interval[]} intervals The list of intervals to check for splits.
 * @returns {interval[]} The list of intervals separated across the midnight
 * boundary where necessary.
 */
export function splitIntervalsOnMidnight(intervals = []) {
  return intervals.flatMap((interval) => {
    const { start, end } = interval;
    if (!start.isSame(end, 'date') && end.hour() !== 0) {
      return [
        { ...interval, start, end: end.startOf('day') },
        { ...interval, start: end.startOf('day'), end },
      ];
    }
    return [interval];
  });
}

/**
 * Given a map of usernames to their intervals, return the combined intervals
 * with the usernames participating in the interval attached.
 * @param {Object.<string, interval[]} intervalsByUsername A map of usernames to
 * the intervals of the username.
 * @returns {{start: dayjs.Dayjs, end: dayjs.Dayjs, usernames: string[]}[]} An
 * array of intervals with the usernames in that interval attached.
 */
export function getMergedIntervals(intervalsByUsername) {
  /**
   * Given a map of usernames to their intervals, describe how usernames are
   * added and removed from the event based on their intervals in
   * chronological order.
   * @param {Object.<string, interval[]>} intervalsByUsername A map of
   * usernames to the intervals of the username.
   * @returns {action[]} An array of chronologically ordered actions which
   * describe the addition or removal of a username across specific times.
   */
  function getActions() {
    const actions = [];
    for (const [username, intervals] of Object.entries(intervalsByUsername)) {
      for (const interval of intervals) {
        actions.push({
          time: interval.start,
          isAdd: true,
          username,
        });
        actions.push({
          time: interval.end,
          isAdd: false,
          username,
        });
      }
    }
    actions.sort((a, b) => a.time - b.time);
    return actions;
  }

  /**
   * Combine actions that occur at the same time into a tuple of an addition
   * action and a removal action.
   * @param {action[]} actions An array of chronologically ordered actions
   * which describe the addition or removal of a user at a specific time.
   * @returns {{addAction: multiUserAction, removeAction: multiUserAction}[]}
   * An array of chronologically ordered pairs of actions describing the
   * combined addition and removal of multiple usernames across specific
   * times.
   */
  function getCombinedActions(actions) {
    const combinedActions = [];
    let actionBuffer = [];
    for (const action of actions) {
      if (actionBuffer.length === 0 || actionBuffer[0].time.isSame(action.time)) {
        actionBuffer.push(action);
      } else {
        combinedActions.push(getCombinedActionOfTime(actionBuffer));
        actionBuffer = [action];
      }
    }
    combinedActions.push(getCombinedActionOfTime(actionBuffer));
    return combinedActions.filter((action) => action.addAction.usernames != null);
  }

  /**
   * Given actions on the same time, get the pair of actions describing the
   * addition and removal of usernames at that time.
   * @param {action[]} actionsWithSameTime An array of actions with the same
   * time.
   * @returns {{addAction: multiUserAction, removeAction: multiUserAction}} A
   * pair of actions describing the combined addition and removal of multiple
   * usernames at a specific time.
   */
  function getCombinedActionOfTime(actionsWithSameTime) {
    const deltabyUsername = {};
    for (const action of actionsWithSameTime) {
      const { username } = action;
      if (Object.keys(deltabyUsername).includes(username)) {
        deltabyUsername[username] += action.isAdd ? 1 : -1;
      } else {
        deltabyUsername[username] = action.isAdd ? 1 : -1;
      }
    }
    const addAction = {
      time: actionsWithSameTime[0].time,
      isAdd: true,
      usernames: [],
    };
    const removeAction = {
      time: actionsWithSameTime[0].time,
      isAdd: false,
      usernames: [],
    };
    for (const [username, delta] of Object.entries(deltabyUsername)) {
      if (delta > 0) {
        addAction.usernames.push(username);
      } else if (delta < 0) {
        removeAction.usernames.push(username);
      }
    }
    return { addAction, removeAction };
  }

  /**
   * Given a chronologically ordered list of actions describing the addition
   * and removal of usernames, determine the distinct intervals and usernames
   * participating in those intervals.
   * @param {{addAction: multiUserAction, removeAction: multiUserAction}[]}
   * combinedActions
   * @returns {{start: dayjs.Dayjs, end: dayjs.Dayjs, usernames: string[]}[]}
   * An array of intervals with the usernames in that interval attached.
   */
  function getIntervalsFromCombinedActions(combinedActions) {
    let currentUsernames = [];
    const currentInterval = {
      start: null,
      end: null,
      usernames: [],
    };
    const result = [];
    for (const { addAction, removeAction } of combinedActions) {
      currentInterval.end = addAction.time;
      result.push({ ...currentInterval });
      // Add and remove members from current members.
      currentUsernames = [...currentUsernames, ...addAction.usernames];
      currentUsernames = currentUsernames
        .filter((member) => removeAction.usernames.indexOf(member) === -1);
      currentInterval.start = addAction.time;
      currentInterval.usernames = [...currentUsernames];
    }
    return result.slice(1);
  }

  if (Object.keys(intervalsByUsername).length === 0) return [];

  const actions = getActions(intervalsByUsername);
  if (actions.length === 0) return [];
  // Array of { addAction, removeAction }.
  const combinedActions = getCombinedActions(actions);
  // Only return intervals which are not empty and do not start and end on the
  // same time.
  return getIntervalsFromCombinedActions(combinedActions)
    .filter((interval) => interval.usernames.length !== 0 && !interval.start.isSame(interval.end));
}

/**
 * Given a list of intervals, get the intervals which make up the negative space
 * around.
 * @param {interval[]} intervals The list of intervals.
 * @returns {interval[]} The list of intervals surrounding the intervals.
 */
export function getNonIntervals(intervals) {
  let previousEnd = intervals[0].start.startOf('day');
  const end = previousEnd.add(1, 'day');
  const result = [];
  for (const interval of intervals) {
    result.push({
      start: previousEnd,
      end: interval.start,
    });
    previousEnd = interval.end;
  }
  result.push({
    start: previousEnd,
    end,
  });
  return result;
}
