<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  import dayjs from 'dayjs';

  // PROPS
  // =====
  export let date;
  export let selected = false;

  // STATE
  // =====
  let firstDayOfWeek = date.date() === 1 ? date.day() : null;

  // STATE FUNCTIONS
  // ===============
  function handleDragStart() {
    dispatch('dragStart', { date, selecting: !selected });
  }

  function handleDragEnter() {
    if (event.buttons !== 1) return;
    dispatch('dragMove', { date });
  }

  function handleDragStop() {
    dispatch('dragStop');
  }
</script>

<div
  style={firstDayOfWeek == null ? '' : `grid-column-start: ${firstDayOfWeek + 1}`}
  on:mousedown={handleDragStart}
  on:mouseenter={handleDragEnter}
  on:mouseup={handleDragStop}
>
  <span
    class:today={date.isSame(dayjs(), 'day')}
    class:before={date.isBefore(dayjs(), 'day')}
    class:selected={selected}
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
    padding: 0.2rem 0;
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

  span.selected {
    color: white;
    background-color: var(--primary-1);
  }
</style>