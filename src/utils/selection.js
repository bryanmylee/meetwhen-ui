import { MS_PER_DAY } from 'src/utils/constants';

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
 *
 * New selections are made with start and end hours being the start of the 15 minute interval.
 *
 * Each quadrant must be handled differently.
 *
 * @param {intervalSeparateDayHour} newSelection The new selection made by
 * the user with days and hours separated.
 * @returns {interval[]} The new selections across different days.
 */
export function getAreaSelection(newSelection) {
  if (newSelection == null) {
    return [];
  }
  const { downDay, downHour, upDay, upHour } = newSelection;
  if (downDay == null || downHour == null || upDay == null || upHour == null) {
    return [];
  }

  const numDaysSpan = Math.floor(Math.abs(upDay - downDay) / MS_PER_DAY) + 1;
  if (+downDay <= +upDay && downHour <= upHour) {
    return [...Array(numDaysSpan)].map((_, i) => ({
      start: downDay.add(i, 'day').add(downHour, 'hour'),
      end: downDay.add(i, 'day').add(upHour + 0.25, 'hour'),
    }));
  }
  if (+downDay <= +upDay && downHour > upHour) {
    return [...Array(numDaysSpan)].map((_, i) => ({
      start: downDay.add(i, 'day').add(upHour, 'hour'),
      end: downDay.add(i, 'day').add(downHour + 0.25, 'hour'),
    }));
  }
  if (+downDay > +upDay && downHour <= upHour) {
    return [...Array(numDaysSpan)].map((_, i) => ({
      start: upDay.add(i, 'day').add(downHour, 'hour'),
      end: upDay.add(i, 'day').add(upHour + 0.25, 'hour'),
    }));
  }
  return [...Array(numDaysSpan)].map((_, i) => ({
    start: upDay.add(i, 'day').add(upHour, 'hour'),
    end: upDay.add(i, 'day').add(downHour + 0.25, 'hour'),
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
   * @returns {{time: dayjs.Dayjs, isStart: boolean}[]} The actions.
   */
  function getActions() {
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

  const actions = getActions();
  const unionSelections = [];
  let currSelection = {};
  let currLayerCount = 0;
  let i = 0;
  while (i < actions.length) {
    const action = actions[i];
    if (action.isStart) {
      currLayerCount++;
    } else {
      currLayerCount--;
    }
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
      unionSelections.push({ ...currSelection, end: action.time });
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
  const actions = getActions();
  const intersectSelections = [];
  let currSelection = {};
  let onA = false;
  let onB = false;
  for (const action of actions) {
    if (action.isStart) {
      if (action.isA) {
        onA = true;
      } else {
        onB = true;
      }
      if (onA && onB) {
        currSelection = { start: action.time };
      }
    } else {
      if (action.isA) {
        onA = false;
      } else {
        onB = false;
      }
      if (currSelection.start != null) {
        intersectSelections.push({ ...currSelection, end: action.time });
        currSelection = {};
      }
    }
  }
  return intersectSelections;

  /**
   * Given an array of selections, return an array of actions describing the
   * starts and ends of intervals sorted by time.
   * @returns {{time: dayjs.Dayjs, isStart: boolean}[]} The actions.
   */
  function getActions() {
    const actionsBuffer = [];
    for (const { start, end } of selectionsA) {
      actionsBuffer.push({
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
      actionsBuffer.push({
        time: start,
        isStart: true,
        isA: false,
      }, {
        time: end,
        isStart: false,
        isA: false,
      });
    }
    actionsBuffer.sort((a, b) => a.time - b.time);
    return actionsBuffer;
  }
}
