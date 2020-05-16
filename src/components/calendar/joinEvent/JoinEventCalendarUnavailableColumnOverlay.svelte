<script>
  export let eventIntervals;
  const nonEventIntervals = getNonEventIntervals(eventIntervals);

  function getNonEventIntervals(eventIntervals) {
    let previousEnd = eventIntervals[0].start.startOf('day');
    const end = previousEnd.add(1, 'day');
    let result = [];
    for (const interval of eventIntervals) {
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

  const MS_PER_HOUR = 3600000;
  const ROW_HEIGHT_IN_REM = 3;

  function getTop(start) {
    const numHoursFromMidnight = start.hour() + start.minute() / 60;
    return `${numHoursFromMidnight * ROW_HEIGHT_IN_REM}rem`;
  }

  function getHeight(start, end) {
    const durationInHours = (end - start) / MS_PER_HOUR;
    return `${durationInHours * ROW_HEIGHT_IN_REM}rem`;
  }
</script>

{#each nonEventIntervals as interval}
  <div
    style="top:{getTop(interval.start)};
           height:{getHeight(interval.start, interval.end)};"
  ></div>
{/each}

<style>
  div {
    position: absolute;
    width: var(--col-width);
    background-color: var(--line-1);
    opacity: 0.5;
    transition: 0.2s ease opacity, 0.2s ease background-color;
    pointer-events: all;
  }
</style>