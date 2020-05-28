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
  const endOnStartDay = end
      .year(start.year())
      .month(start.month())
      .date(start.date()); 

  const selections = [];
  // Determine how many days are included from start to end.
  const numDaysSpan = Math.floor((end - start) / 86400000) + 1;
  for (let i = 0; i < numDaysSpan; i++) {
    selections.push({
      start: start.add(i, 'day'),
      end: endOnStartDay.add(i, 'day'),
    });
  }
  return selections;
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
