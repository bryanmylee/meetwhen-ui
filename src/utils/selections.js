import dayjs from 'dayjs';

/**
 * @typedef {{start: dayjs.Dayjs, end: dayjs.Dayjs}} interval
 */

/**
 * Given a selection that spans multiple days, create an array of selections
 * with the same start and end times, but with incrementing dates.
 * @param {interval} newSelection The new selection made by
 * the user.
 * @returns {interval[]} The new selections across different days.
 */
export function getMultiDaySelection(newSelection) {
  if (newSelection == null || newSelection.start == null) return [];
  const { start, end } = newSelection;
  // Make sure to set year and month first, as some start dates are invalid on
  // the end month and year.
  let endOnStartDay = end
      .year(start.year())
      .month(start.month())
      .date(start.date()); 

  // Account for midnight difference.
  if (endOnStartDay.hour() === 0
      && endOnStartDay.minute() === 0
      && endOnStartDay.second() === 0
      && endOnStartDay.millisecond() === 0) {
    endOnStartDay = endOnStartDay.add(1, 'day');
  }

  const selections = [];
  // Determine how many days are included from start to end.
  const MS_PER_DAY = 86400000;
  const numDaysSpan = Math.floor((end - start) / MS_PER_DAY) + 1;
  for (let i = 0; i < numDaysSpan; i++) {
    selections.push({
      start: start.add(i, 'day'),
      end: endOnStartDay.add(i, 'day'),
    });
  }
  return selections;
}

/**
 * Given an array of selections, union selections which are adjacent to or
 * overlapping one another.
 * @param {interval[]} selections The selections to merge.
 * @returns {interval[]} The selections without any overlaps.
 */
export function getUnionOfSelections(selections) {
  /**
   * Given an array of selections, return an array of actions describing the
   * starts and ends of intervals sorted by time.
   * @param {interval[]} selections The selections to get the time of.
   * @returns {{time: dayjs.Dayjs, isStart: boolean}[]} The actions.
   */
  function getActions(selections) {
    const actions = [];
    for (const { start, end } of selections) {
      actions.push({
        time: start,
        isStart: true,
      }, {
        time: end,
        isStart: false,
      });
    }
    actions.sort((a, b) => a.time - b.time);
    return actions;
  }
  
  const actions = getActions(selections);
  const unionSelections = [];
  let currSelection = {};
  let currLayerCount = 0;
  let i = 0;
  while (i < actions.length) {
    const action = actions[i];
    action.isStart ? currLayerCount++ : currLayerCount--;
    // Guaranteed to be the last "end" action on a given time.
    if (currLayerCount === 0 && !action.isStart) {
      // Guaranteed to be a "start" action.
      if (i + 1 < actions.length && action.time.isSame(actions[i + 1].time)) {
        currLayerCount++;
        i += 2;
        continue;
      }
      unionSelections.push({ ...currSelection, end: action.time});
    } else if (currLayerCount === 1 && action.isStart) {
      currSelection = { start: action.time };
    }
    i++;
  }
  return unionSelections;
}

/**
 * Given two arrays of selections, find the intersection of both selections.
 * @param {interval[]} selectionsA The first array of selections.
 * @param {interval[]} selectionsB The other array of selections.
 * @returns {interval[]} The intersection of both selections.
 */
export function getIntersectionOfSelections(selectionsA, selectionsB) {
  /**
   * Given an array of selections, return an array of actions describing the
   * starts and ends of intervals sorted by time.
   * @param {interval[]} selectionsA The first array of selections.
   * @param {interval[]} selectionsB The other array of selections.
   * @returns {{time: dayjs.Dayjs, isStart: boolean}[]} The actions.
   */
  function getActions(selectionsA, selectionsB) {
    const actions = [];
    for (const { start, end } of selectionsA) {
      actions.push({
        time: start,
        isStart: true,
        isA: true,
      }, {
        time: end,
        isStart: false,
        isA: true,
      });
    }
    for (const { start, end } of selectionsB) {
      actions.push({
        time: start,
        isStart: true,
        isA: false,
      }, {
        time: end,
        isStart: false,
        isA: false,
      });
    }
    actions.sort((a, b) => a.time - b.time);
    return actions;
  }

  const actions = getActions(selectionsA, selectionsB);
  const intersectSelections = [];
  let currSelection = {};
  let onA = false;
  let onB = false;
  for (const action of actions) {
    if (action.isStart) {
      action.isA ? onA = true : onB = true;
      if (onA && onB) {
        currSelection = { start: action.time };
      }
    } else {
      action.isA ? onA = false : onB = false;
      if (currSelection.start != null) {
        intersectSelections.push({ ...currSelection, end: action.time });
        currSelection = {};
      }
    }
  }
  return intersectSelections;
}

const MS_PER_HOUR = 3600000;
const ROW_HEIGHT_IN_REM = 3;

export function getTop(start) {
  const numHoursFromMidnight = start.hour() + start.minute() / 60;
  return `${numHoursFromMidnight * ROW_HEIGHT_IN_REM}rem`;
}

export function getHeight(durationInMs) {
  const durationInHours = durationInMs / MS_PER_HOUR;
  return `${durationInHours * ROW_HEIGHT_IN_REM}rem`;
}
