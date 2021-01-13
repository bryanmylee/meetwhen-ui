<script lang="ts">
  import { primary } from '@my/state/colors';
  import { getTop, getHeight } from '@my/utils/eventCalendar';
  import type { Dayjs } from 'dayjs';
  import type { Scale } from 'chroma-js';

  export let from: Dayjs = null;
  export let to: Dayjs = null;
  export let users: string[] = [];
  export let hours: Dayjs[] = [];
  export let maxPerInterval = 0;

  export let editable = false;

  export let hasTop = false;
  export let hasBottom = false;

  const getColor = (num: number, total: number, scale: Scale) => {
    const MAX_DARK = 10;
    const darkRatio = total / MAX_DARK;
    const darkest = 0.5 + darkRatio * 0.5;
    const ratio = num * darkest / total;
    return scale(ratio).hex();
  };
</script>

<div
  class={`absolute left-0 rounded-xl
    ${hasTop ? 'rounded-t-none' : ''}
    ${hasBottom ? 'rounded-b-none' : ''}
    ${editable ? 'w-1/5' : 'w-full'}
  `.replace(/\s\s+/g, ' ')}
  style={`
    background-color: ${getColor(users.length, maxPerInterval, $primary.scale)};
    top: ${getTop(from, hours)}%;
    height: ${getHeight(from, to, hours)}%;
    transition: width 200ms ease-out;
  `}
/>

