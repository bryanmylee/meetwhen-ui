<script lang="ts" context="module">
  let hoveredId: Writable<number> = writable(null);
  let activeId: Writable<number> = writable(null);
</script>

<script lang="ts">
  import type { Interval as IInterval, ShallowUser } from '$lib/gql/types';
  import type { Writable } from 'svelte/store';
  import { writable } from 'svelte/store';
  import { primary } from '$lib/colors';
  import { maxNumUsersPerInterval, intervalHasAfter, intervalHasBefore } from './state/schedules';
  import { clickOutside } from '$lib/utils/use-click-outside';
  import Interval from './Interval.svelte';
  import SchedulePopover from './SchedulePopover.svelte';
  import { cx } from '$lib/utils/cx';
  import { cssVars } from '$lib/utils/use-css-vars';
  import { getContext } from 'svelte';

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

  $: color = (() => {
    const MAX_DARK = 10;
    const darkRatio = $maxNumUsersPerInterval / MAX_DARK;
    const darkest = 0.5 + darkRatio * 0.5;
    const ratio = (users.length * darkest) / $maxNumUsersPerInterval;
    return $primary.scale(ratio);
  })();

  $: bgHex = color.hex();

  const disabled = getContext<Writable<boolean>>('disabled');

  // prettier-ignore
  $: intervalClass = cx(
    'interval relative h-full pointer-events-auto',
    [!$intervalHasBefore(interval), 'rounded-t-xl'],
    [!$intervalHasAfter(interval), 'rounded-b-xl', 'border-b-2 border-white dark:border-gray-900'],
    [isHovered || isActive, 'ring-2 ring-offset-[3px] ring-inset ring-white dark:ring-gray-900'],
    [isHovered && !isActive, 'ring-offset-gray-400'],
    [isActive, 'ring-offset-primary dark:ring-offset-primary-lighter'],
    [$disabled, 'w-full', 'w-6']
  );
</script>

<Interval {interval} class="pointer-events-none">
  <div
    on:click={handleClick}
    use:clickOutside={handleClickOutside}
    on:mousemove={handleMouseMove}
    on:mouseenter={() => ($hoveredId = id)}
    on:mouseleave={() => ($hoveredId = null)}
    on:transitionend={() => popover.updatePopoverPosition()}
    use:cssVars={{ bgHex }}
    class={intervalClass}
  >
    <div bind:this={referenceElement} class="w-full" />
    <SchedulePopover
      bind:this={popover}
      on:dismiss={() => ($activeId = null)}
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
    background-color: var(--bgHex);
    transition: width 300ms ease-out;
  }
</style>
