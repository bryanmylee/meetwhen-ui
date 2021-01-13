<script lang="ts">
  import dayjs from 'dayjs';
  import SelectState from '@my/models/SelectState';
  import type { Dayjs } from 'dayjs';

  export let date: Dayjs;
  $: columnStart = date.date() === 1 ? date.day() || 7 : '';

  export let selected = false;
  export let selecting: SelectState;
  $: creating = selecting === SelectState.CREATE;
  $: deleting = selecting === SelectState.DELETE;

  export let hasLeft = false;
  export let hasRight = false;
  export let hasTop = false;
  export let hasBottom = false;
  export let disabled = false;
  export let focused = false;

  const isToday = date.isSame(dayjs(), 'day');

  let element: HTMLElement;
</script>

<div
  bind:this={element}
  data-id={date.format('YYYYMMDD')}
  class={`
    p-2 text-center rounded-xl transition
    border-3 border-transparent focus:outline-none
    ${disabled ? 'text-gray-400' : ''}
    ${selected
      ? `bg-primary text-white shadow-primary z-10
        ${creating ? 'shadow-lg-primary' : ''}
        ${deleting ? 'bg-primary-opacity-60' : ''}
        ${hasLeft ? 'rounded-l-none' : ''}
        ${hasRight ? 'rounded-r-none' : ''}
        ${hasTop ? 'rounded-t-none' : ''}
        ${hasBottom ? 'rounded-b-none' : ''}
        ${focused ? 'border-white' : ''}
      `
      : `z-0 ${isToday ? 'text-primary' : ''}
        ${focused ? 'border-primary-lighter': ''}
        ${!selecting && !disabled ? 'hover:bg-gray-200' : ''}
    `}
    ${disabled ? '' : 'cursor-pointer'}
  `.replace(/\s\s+/g, ' ')}
  style={`
    grid-column-start: ${columnStart};
  `}
  >
  {date.date()}
</div>

