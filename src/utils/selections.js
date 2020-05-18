// Separate a multi-day new selection into multiple single-day selections.
export function splitMultiDaySelection(newSelection) {
  if (newSelection == null || newSelection.start == null) return [];
  const { start, end } = newSelection;
  const endOnStartDay = end
      .date(start.date())
      .month(start.month())
      .year(start.year());
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

export function getNonSelections(selections) {
  let previousEnd = selections[0].start.startOf('day');
  const end = previousEnd.add(1, 'day');
  let result = [];
  for (const selection of selections) {
    result.push({
      start: previousEnd,
      end: selection.start,
    });
    previousEnd = selection.end;
  }
  result.push({
    start: previousEnd,
    end,
  });
  return result;
}