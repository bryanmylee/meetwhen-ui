<script lang="ts" context="module">
  export interface EventCalendarUserIntervalEvent {
    intervalclick: {
      xIndex: number;
      yIndex: number;
      focused: boolean;
    };
  }
</script>

<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte';
  import { createPopperActions } from 'svelte-popperjs';
  import { primary } from '@my/state/colors';
  import { getTop, getHeight } from '@my/utils/eventCalendar';
  import type { Readable } from 'svelte/store';
  import type { Dayjs } from 'dayjs';
  import type { Scale } from 'chroma-js';
  import type { OptionsGeneric, StrictModifiers } from '@popperjs/core';

  const dispatch = createEventDispatcher<EventCalendarUserIntervalEvent>();

  export let xIndex = 0;
  export let yIndex = 0;

  function click() {
    dispatch('intervalclick', {
      xIndex,
      yIndex,
      focused,
    });
  }

  export let from: Dayjs = null;
  export let to: Dayjs = null;
  export let users: string[] = [];
  export let hours: Dayjs[] = [];
  export let maxPerInterval = 0;
  const allUsers = getContext<Readable<string[]>>('allUsers');
  $: nonUsers = $allUsers.filter(u => !users.includes(u));

  export let editable = false;

  export let hasTop = false;
  export let hasBottom = false;

  export let focused = false;

  const getColor = (num: number, total: number, scale: Scale) => {
    const MAX_DARK = 10;
    const darkRatio = total / MAX_DARK;
    const darkest = 0.5 + darkRatio * 0.5;
    const ratio = num * darkest / total;
    return scale(ratio);
  };

  const getBorder = (num: number, total: number, scale: Scale) => {
    const bg = getColor(num, total, scale);
    if (bg.luminance() < 0.4) {
      return bg.brighten(2).desaturate();
    } else {
      return bg.darken(2);
    }
  };

  let hovered = false;
  const [ref, popper] = createPopperActions<StrictModifiers>();
  const options: OptionsGeneric<StrictModifiers> = {
    placement: 'right',
    strategy: 'absolute',
    modifiers: [
      { name: 'preventOverflow', options: {
        altAxis: true,
        padding: 12,
      }},
      { name: 'offset', options: {
        offset: [0, 12],
      }},
    ],
  };
</script>

<div
  use:ref
  on:click={click}
  on:mouseenter={() => hovered = true}
  on:mouseleave={() => hovered = false}
  class={`
    absolute left-0 rounded-xl z-0
    border-0 focus:outline-none cursor-pointer
    ${hasTop ? 'rounded-t-none' : ''}
    ${hasBottom ? 'rounded-b-none' : ''}
    ${editable ? 'w-6' : 'w-full'}
    ${focused || hovered ? 'border-3 shadow-xl-primary z-10' : ''}
  `.replace(/\s\s+/g, ' ')}
  style={`
    border-color: ${getBorder(users.length, maxPerInterval, $primary.scale).hex()};
    background-color: ${getColor(users.length, maxPerInterval, $primary.scale).hex()};
    top: ${getTop(from, hours)}%;
    height: ${getHeight(from, to, hours)}%;
    transition: width 200ms ease-out;
  `}
/>

{#if focused || hovered}
  <div
    use:popper={options}
    class="z-30 text-xs bg-white pointer-events-none card w-max"
    >
    <p class="p-3 italic text-gray-600">
      {from.format('HH:mm')} - {to.format('HH:mm')}
    </p>
    <div class="p-3 border-t space-y-2">
      <div class="font-bold">{users.length} attending</div>
      <div>
        {#each users as user}
          <p>{user}</p>
        {/each}
      </div>
    </div>
    {#if nonUsers.length !== 0}
      <div class="p-3 border-t space-y-2">
        <div class="font-bold">{nonUsers.length} not attending</div>
        <div class="text-gray-400">
          {#each nonUsers as user}
            <p>{user}</p>
          {/each}
        </div>
      </div>
    {/if}
  </div>
{/if}

