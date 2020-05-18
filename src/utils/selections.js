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