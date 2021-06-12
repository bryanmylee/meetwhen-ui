<script lang="ts" context="module">
  let hoveredId: Writable<number> = writable(null);
  let activeId: Writable<number> = writable(null);
</script>

<script lang="ts">
  import Interval from './Interval.svelte';
  import type { Interval as IInterval, ShallowUser } from '$lib/gql/types';
  import type { Writable } from 'svelte/store';
  import { writable } from 'svelte/store';
  import SchedulePopover from './SchedulePopover.svelte';

  export let id: number;
  export let interval: IInterval;
  export let users: ShallowUser[];

  const handleClick = (event: MouseEvent) => {
    $activeId = id;
    updateRefPosition(event);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if ($activeId !== id) {
      updateRefPosition(event);
    }
  };

  let popover: SchedulePopover;
  let intervalElement: HTMLDivElement;
  let referenceElement: HTMLDivElement;

  const updateRefPosition = (event: MouseEvent) => {
    const intervalRect = intervalElement.getBoundingClientRect();
    const top = Math.max(0, event.clientY - intervalRect.top);
    referenceElement.style.position = 'absolute';
    referenceElement.style.left = '0';
    referenceElement.style.top = `${top}px`;
    referenceElement.style.width = `${intervalRect.width}px`;
    popover.updatePopoverPosition();
  };
</script>

<Interval {interval}>
  <div
    bind:this={intervalElement}
    on:click={handleClick}
    on:mousemove={handleMouseMove}
    on:mouseenter={() => ($hoveredId = id)}
    on:mouseleave={() => ($hoveredId = null)}
    class="relative w-full h-full rounded-xl bg-red-300"
  >
    <div bind:this={referenceElement} />
  </div>
</Interval>

{#if $activeId === id || $hoveredId === id}
  <SchedulePopover bind:this={popover} {referenceElement} {interval} {users} />
{/if}
