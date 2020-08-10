<script>
  import dayjs from 'dayjs';

  // PROPS
  // =====
  export let date;
  export let selected = false;

  // REACTIVE ATTRIBUTES
  // =====
  $: firstDayOfWeek = date.date() === 1 ? date.day() : null;
  $: isPast = date.isBefore(dayjs(), 'day');
</script>

<div
  style={firstDayOfWeek == null ? '' : `grid-column-start: ${firstDayOfWeek + 1}`}
  class:past={isPast}
  class:today={date.isSame(dayjs(), 'day')}
  class:selected={selected}
  data-date-target
  data-date-ms={+date}
  data-selected={selected}
  data-is-past={isPast}
>
  <span
    data-date-target
    data-date-ms={+date}
    data-selected={selected}
    data-is-past={isPast}
  >
    {date.date()}
  </span>
</div>

<style>
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 0.2em 0;
  }

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 500px;
    min-height: 2.5em;
    min-width: 2.5em;
    max-height: 2.5em;
    max-width: 2.5em;
    color: var(--text-800);
  }

  span:hover {
    background-color: var(--grey-200);
  }

  div.today > span {
    color: var(--primary-500);
    border: 1px var(--primary-500) solid;
  }

  div.past {
    cursor: unset;
  }

  div.past > span {
    color: var(--text-400);
  }

  div.past > span:hover {
    background-color: unset;
  }


  div.selected > span {
    color: white;
    background-color: var(--primary-500);
  }
</style>