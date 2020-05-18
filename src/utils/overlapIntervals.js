import dayjs from 'dayjs';
/**
 * @typedef {{start: dayjs.Dayjs, end: dayjs.Dayjs}} interval
 * @typedef {{time: dayjs.Dayjs, isAdd: boolean, username: string}} action
 * @typedef {{time: dayjs.Dayjs, isAdd: boolean, usernames: string[]}} multiUserAction
 */

/**
 * Given a map of usernames to their intervals, return the combined intervals
 * with the usernames participating in the interval attached.
 * @param {Object.<string, interval[]} intervalsByUsername A map of usernames to
 * the intervals of the username.
 * @returns {{start: dayjs.Dayjs, end: dayjs.Dayjs, usernames: string[]}[]} An
 * array of intervals with the usernames in that interval attached.
 */
export function getMerged(intervalsByUsername) {
  const actions = getActions(intervalsByUsername);
  // Array of { addAction, removeAction }.
  const combinedActions = getCombinedActions(actions);
  console.log(getIntervalsFromCombinedActions(combinedActions));
}

/**
 * Given a map of usernames to their intervals, describe how usernames are added
 * and removed from the event based on their intervals in chronological order.
 * @param {Object.<string, interval[]>} intervalsByUsername A map of usernames to
 * the intervals of the username.
 * @returns {action[]} An array of chronologically ordered actions which
 * describe the addition or removal of a username across specific times.
 */
function getActions(intervalsByUsername) {
  const actions = [];
  for (const [ username, intervals ] of Object.entries(intervalsByUsername)) {
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
 * @returns {{addAction: multiUserAction, removeAction: multiUserAction}[]} An
 * array of chronologically ordered pairs of actions describing the combined
 * addition and removal of multiple usernames across specific times.
 */
function getCombinedActions(actions) {
  const combinedActions = [];
  let actionBuffer = [];
  for (const action of actions) {
    if (actionBuffer.length === 0 || actionBuffer[0].time === action.time) {
      actionBuffer.push(action);
    } else {
      combinedActions.push(getCombinedActionOfTime(actionBuffer));
      actionBuffer = [ action ];
    }
  }
  combinedActions.push(getCombinedActionOfTime(actionBuffer));
  return combinedActions;
}

/**
 * Given actions on the same time, get the pair of actions describing the
 * addition and removal of usernames at that time.
 * @param {action[]} actionsWithSameTime An array of actions with the same time.
 * @returns {{addAction: multiUserAction, removeAction: multiUserAction}} A pair
 * of actions describing the combined addition and removal of multiple usernames
 * at a specific time.
 */
function getCombinedActionOfTime(actionsWithSameTime) {
  deltabyUsername = {};
  for (const action of actionsWithSameTime) {
    for (const username of action.username) {
      if (deltabyUsername.hasOwnProperty(username)) {
        deltabyUsername[username] += action.isAdd ? 1 : -1;
      } else {
        deltabyUsername[username] = action.isAdd ? 1 : -1;
      }
    }
  }
  const addAction = ({
    time: actionsWithSameTime[0].time,
    isAdd: true,
    usernames: [],
  });
  const removeAction = ({
    time: actionsWithSameTime[0].time,
    isAdd: false,
    usernames: [],
  });
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
 * Given a chronologically ordered list of actions describing the addition and 
 * removal of usernames, determine the distinct intervals and usernames
 * participating in those intervals.
 * @param {{addAction: multiUserAction, removeAction: multiUserAction}[]} combinedActions 
 * @returns {{start: dayjs.Dayjs, end: dayjs.Dayjs, usernames: string[]}[]} An
 * array of intervals with the usernames in that interval attached.
 */
function getIntervalsFromCombinedActions(combinedActions) {
  let currentUsernames = [];
  const currentInterval = ({
    start: null,
    end: null,
    usernames: [],
  });
  const result = [];
  for ({ addAction, removeAction } of combinedActions) {
    currentInterval.end = addAction.time;
    result.push({ ...currentInterval });
    // Add and remove members from current members.
    currentUsernames = [ ...currentUsernames, ...addAction.usernames ];
    currentUsernames = currentUsernames.filter((member) => {
      return removeAction.usernames.indexOf(member) === -1
    });
    currentInterval.start = addAction.time;
    currentInterval.usernames = [ ...currentUsernames ];
  }
  return result.slice(1);
}

const intervalsByUsername = {
  'A': [
    { start: 0, end: 6 },
    { start: 8, end: 10 },
  ],
  'B': [
    { start: 0, end: 1, members: ['B'] },
    { start: 2, end: 4, members: ['B'] },
    { start: 5, end: 8, members: ['B'] },
    { start: 9, end: 12, members: ['B'] },
  ],
  'C': [
    { start: 0, end: 1, members: ['C'] },
    { start: 5, end: 9, members: ['C'] },
  ],
}