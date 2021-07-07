<script lang="ts">
  import { classes } from '$lib/utils/classes';
  import { onMount } from 'svelte';

  export let x = 0;
  export let y = 0;
  export let triggerDelay = 100;

  // time to wait after trigger before unmounting element.
  export const triggerDuration = 200;

  let expanding = false;
  let triggered = false;

  onMount(() => {
    requestAnimationFrame(() => {
      expanding = true;
    });
    setTimeout(() => {
      triggered = true;
    }, triggerDelay);
  });
</script>

<div
  id="indicator"
  class={classes([
    'fixed w-28 h-28 rounded-full pointer-events-none bg-primary-fifty',
    !expanding && 'opacity-0',
    triggered && 'border-4 border-primary-darker dark:border-white',
  ])}
  class:expanding
  style="left: {x}px; top: {y}px; --triggerDelay: {triggerDelay}ms"
/>

<style lang="postcss">
  div {
    transform: translate(-50%, -50%) scale(0.25);
    transition: transform var(--triggerDelay) ease-out, opacity var(--triggerDelay) ease-out;
  }

  div.expanding {
    transform: translate(-50%, -50%) scale(1);
  }
</style>
