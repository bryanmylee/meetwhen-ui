<script lang="ts">
  import dayjs from 'dayjs';
  import type { Dayjs } from 'dayjs';
  import { Selecting } from '$lib/components/SelectableProvider/selecting';
  import { cx } from '$lib/utils/cx';
  import type { HasNeighbours } from './has-neighbours';
  import { toId } from './state';

  export let date: Dayjs;
  $: columnStart = date.date() === 1 ? date.day() || 7 : '';
  $: isToday = date.isSame(dayjs(), 'day');

  export let selected = false;
  export let selecting: Selecting;
  $: isCreating = selecting === Selecting.CREATE;
  $: isDeleting = selecting === Selecting.DELETE;

  export let neighbours: HasNeighbours = { bottom: false, left: false, right: false, top: false };

  export let disabled = false;
  export let focused = false;

  $: className = cx(
    'p-2 text-center rounded-xl transition border-3 focus:outline-none select-none-all',
    [!focused, 'border-transparent'],
    [disabled, 'text-gray-400', 'cursor-pointer'],
    [selected, selectedClass, unselectedClass]
  );
  $: selectedClass = cx(
    'bg-primary text-white shadow-primary z-10',
    [isCreating, 'shadow-lg-primary'],
    [isDeleting, 'bg-primary-sixty'],
    [focused, 'border-white'],
    [neighbours.bottom, 'rounded-b-none'],
    [neighbours.left, 'rounded-l-none'],
    [neighbours.right, 'rounded-r-none'],
    [neighbours.top, 'rounded-t-none']
  );
  $: unselectedClass = cx(
    'z-0',
    [isToday, 'text-primary'],
    [focused, 'border-primary-lighter'],
    [!selecting && !disabled, 'hover:bg-gray-200']
  );
</script>

<div data-id={toId(date)} class={className} style="grid-column-start: {columnStart}">
  {date.date()}
</div>
