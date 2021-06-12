<script lang="ts" context="module">
  let hoveredId: Writable<number> = writable(null);
  let activeId: Writable<number> = writable(null);
</script>

<script lang="ts">
  import toCss from 'style-css';
  import type { Interval as IInterval, ShallowUser } from '$lib/gql/types';
  import type { Writable } from 'svelte/store';
  import { writable } from 'svelte/store';
  import { primary } from '$lib/colors';
  import { allUsers, maxNumUsersPerInterval } from './state/schedules';
  import Interval from './Interval.svelte';
  import SchedulePopover from './SchedulePopover.svelte';
  import { cx } from '$lib/utils/cx';

  export let id: number;
  export let interval: IInterval;
  export let users: ShallowUser[];

  const handleClick = (event: MouseEvent) => {
    $activeId = id;
    popover.updateRefPosition(event);
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

  // prettier-ignore
  $: intervalClass = cx(
    'relative w-full h-full rounded-xl',
    [isHovered || isActive, 'ring-[3px] dark:ring-offset-gray-900 ring-offset-2 z-10'],
    [isHovered && !isActive, 'ring-primary-lighter'],
    [isActive, 'ring-gray-400'],
  )

  $: intervalStyle = toCss({ backgroundColor: bgHex });
</script>

<Interval {interval}>
  <div
    on:click={handleClick}
    on:mousemove={handleMouseMove}
    on:mouseenter={() => ($hoveredId = id)}
    on:mouseleave={() => ($hoveredId = null)}
    class={intervalClass}
    style={intervalStyle}
  >
    <div bind:this={referenceElement} />
  </div>
</Interval>

<SchedulePopover
  bind:this={popover}
  show={isActive || isHovered}
  fixed={isActive}
  {referenceElement}
  {interval}
  {users}
/>
