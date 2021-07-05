<script lang="ts" context="module">
  let hoveredId: Writable<number> = writable(null);
  let activeId: Writable<number> = writable(null);
</script>

<script lang="ts">
  import type { Interval as IInterval, ShallowUser } from '$lib/gql/types';
  import type { Writable } from 'svelte/store';
  import { writable } from 'svelte/store';
  import { primary } from '$lib/colors';
  import { clickOutside } from '$lib/utils/use-click-outside';
  import Interval from './Interval.svelte';
  import SchedulePopover from './SchedulePopover.svelte';
  import { classes } from '$lib/utils/classes';
  import { cssVars } from '$lib/utils/use-css-vars';
  import { getContext } from 'svelte';
  import type { CalendarState } from './state/core';

  const state = getContext<CalendarState>('state');
  const { maxNumUsersPerInterval, intervalHasAfter, intervalHasBefore } = state;

  export let id: number;
  export let interval: IInterval;
  export let users: ShallowUser[];

  const handleClick = (event: MouseEvent) => {
    if ($activeId === id) {
      $activeId = null;
    } else {
      $activeId = id;
    }
    popover.updateRefPosition(event);
  };

  const handleClickOutside = () => {
    if ($activeId === id) {
      $activeId = null;
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if ($activeId !== id) {
      popover.updateRefPosition(event);
    }
  };

  let popover: SchedulePopover;
  let referenceElement: HTMLDivElement;

  $: isActive = $activeId === id;
  $: isHovered = $hoveredId === id;

  $: bgColor = $primary.getFractional(users.length, $maxNumUsersPerInterval).css();

  const disabled = getContext<Writable<boolean>>('disabled');

  $: intervalClass = classes([
    'interval relative h-full pointer-events-auto',
    !$intervalHasBefore(interval) && 'rounded-t-xl',
    !$intervalHasAfter(interval) ? 'rounded-b-xl' : 'border-b-2 border-white dark:border-gray-900',
    (isHovered || isActive) && 'ring-2 ring-offset-[3px] ring-inset ring-white dark:ring-gray-900',
    isHovered && !isActive && 'ring-offset-gray-400',
    isActive && 'ring-offset-primary dark:ring-offset-primary-lighter',
    $disabled ? 'w-full' : 'w-4 !rounded-r-none !ring-offset-2',
  ]);
</script>

<Interval {interval} class="pointer-events-none">
  <div
    on:click={handleClick}
    use:clickOutside={handleClickOutside}
    on:mousemove={handleMouseMove}
    on:mouseenter={() => ($hoveredId = id)}
    on:mouseleave={() => ($hoveredId = null)}
    on:transitionend={() => popover.updatePopoverPosition()}
    use:cssVars={{ bgColor }}
    class={intervalClass}
  >
    <div bind:this={referenceElement} class="w-full" />
    <SchedulePopover
      bind:this={popover}
      show={isActive || isHovered}
      fixed={isActive}
      {referenceElement}
      {interval}
      {users}
    />
  </div>
</Interval>

<style lang="postcss">
  .interval {
    background-color: var(--bgColor);
    transition: width 150ms ease-out;
  }
</style>
