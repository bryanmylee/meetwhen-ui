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
  import type { Scale } from 'chroma-js';
  import { cx } from '$lib/utils/cx';
  import { hex } from 'chroma-js';

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
  $: activeHex = color.darken(2).hex();
  $: highlightHex = color.brighten(2).hex();

  $: style = toCss({
    backgroundColor: bgHex,
    borderColor: isActive ? activeHex : isHovered ? highlightHex : 'transparent',
  });

  // prettier-ignore
  $: referenceClass = cx(
    'h-1 pointer-events-none ml-[-3px]',
    [!isHovered, 'hidden'],
  );
</script>

<Interval {interval}>
  <div
    on:click={handleClick}
    on:mousemove={handleMouseMove}
    on:mouseenter={() => ($hoveredId = id)}
    on:mouseleave={() => ($hoveredId = null)}
    class="relative w-full h-full rounded-xl border-3 bg-clip-border"
    {style}
  >
    <div bind:this={referenceElement} />
  </div>
</Interval>

<SchedulePopover
  bind:this={popover}
  show={isActive || isHovered}
  {referenceElement}
  {interval}
  {users}
/>
