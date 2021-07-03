<script lang="ts">
  import { fade } from 'svelte/transition';
  import { createPopperActions } from 'svelte-popperjs';

  const [ref, content] = createPopperActions({
    modifiers: [{ name: 'offset', options: { offset: [0, 25] } }],
  });

  export let transitioning: boolean;

  let hovering = false;
</script>

<div
  use:ref
  on:blur={() => (hovering = false)}
  on:focus={() => (hovering = true)}
  on:mouseleave={() => (hovering = false)}
  on:mouseenter={() => (hovering = true)}
>
  <slot />
</div>

{#if hovering && !transitioning}
  <div use:content transition:fade|local={{ duration: 150 }} class="relative p-4 card">
    <h2 class="mb-2 font-bold text-center">Why use a full account?</h2>
    <ul>
      <li class="ml-4 list-disc list-outside">Save account details between meetings</li>
      <li class="ml-4 list-disc list-outside">Keep track of all meetings</li>
      <li class="ml-4 list-disc list-outside">Integrate third-party calendars</li>
    </ul>
  </div>
{/if}
