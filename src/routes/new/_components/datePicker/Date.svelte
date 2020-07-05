<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  import dayjs from 'dayjs';

  export let date;
  export let firstDayOfWeek = null;
</script>

<div
  style={firstDayOfWeek == null ? '' : `grid-column-start: ${firstDayOfWeek + 1}`}
  on:mousedown={() => dispatch('selectStart', { date })}
  on:mousemove={() => dispatch('selectMove', { date })}
  on:mouseup={() => dispatch('selectStop', { date })}
>
  <span
    class:today={date.isSame(dayjs(), 'day')}
    class:before={date.isBefore(dayjs(), 'day')}
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
  }

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 500px;
    min-height: 2.5rem;
    min-width: 2.5rem;
    max-height: 2.5rem;
    max-width: 2.5rem;
    color: var(--text-0);
  }

  span:hover {
    background-color: var(--background-1);
  }

  .today {
    color: var(--primary-1);
    border: 1px var(--primary-1) solid;
  }

  .before {
    color: var(--text-3);
  }
</style>