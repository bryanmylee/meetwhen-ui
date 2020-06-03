import dayjs from 'dayjs';

/**
 * @typedef {{
 *   startDay: dayjs.Dayjs,
 *   startHour: number,
 *   endDay: dayjs.Dayjs,
 *   endHour: number
 * }} intervalSeparateDayHour
 * @typedef {{start: dayjs.Dayjs, end: dayjs.Dayjs}} interval
 */

/**
 * Given a selection that spans multiple days, create an array of selections
 * with the same start and end times, but with incrementing dates.
 * @param {intervalSeparateDayHour} newSelection The new selection made by
 * the user with days and hours separated.
 * @returns {interval[]} The new selections across different days.
 */
export function getAreaSelection(newSelection) {
  if (newSelection == null
      || newSelection.startDay == null
      || newSelection.startHour == null ) return [];

  const { startDay, startHour, endDay, endHour } = newSelection;

  const MS_PER_DAY = 86400000;
  const numDaysSpan = Math.floor(Math.abs(endDay - startDay) / MS_PER_DAY) + 1;
  if (+startDay <= +endDay && startHour <= endHour) {
    return [...Array(numDaysSpan).keys()].map((inc) => ({
      start: startDay.add(inc, 'day').add(startHour, 'hour'),
      end: startDay.add(inc, 'day').add(endHour, 'hour'),
    }));
  }
  if (+startDay <= +endDay && startHour > endHour) {
    return [...Array(numDaysSpan).keys()].map((inc) => ({
      start: startDay.add(inc, 'day').add(endHour, 'hour'),
      end: startDay.add(inc, 'day').add(startHour, 'hour'),
    }));
  }
  if (+startDay > +endDay && startHour <= endHour) {
    return [...Array(numDaysSpan).keys()].map((inc) => ({
      start: endDay.add(inc, 'day').add(startHour, 'hour'),
      end: endDay.add(inc, 'day').add(endHour, 'hour'),
    }));
  }
  return [...Array(numDaysSpan).keys()].map((inc) => ({
    start: endDay.add(inc, 'day').add(endHour, 'hour'),
    end: endDay.add(inc, 'day').add(startHour, 'hour'),
  }));
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
    actions.sort((a, b) => {
      if (!a.time.isSame(b.time)) return a.time - b.time;
      if (a.isStart !== b.isStart) return a.isStart ? 1 : -1;
      return 0;
    });
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
      // The next action is guaranteed to be a "start" action. Check if the
      // actions are adjacent, and merge if they are.
      // If the boundary is on midnight, ignore the adjacent merge.
      if (i + 1 < actions.length
          && action.time.isSame(actions[i + 1].time)
          && !action.time.isSame(action.time.startOf('day'))) {
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

export function getTop(startHourInMs) {
  const numHoursFromMidnight = startHourInMs / MS_PER_HOUR;
  return `calc(var(--row-height) * ${numHoursFromMidnight})`;
}

export function getHeight(durationInMs) {
  const durationInHours = durationInMs / MS_PER_HOUR;
  return `calc(var(--row-height) * ${durationInHours})`;
}
