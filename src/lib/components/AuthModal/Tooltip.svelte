<script lang="ts">
  import { fade } from 'svelte/transition';
  import { createPopperActions } from 'svelte-popperjs';

  const [ref, content] = createPopperActions({
    modifiers: [{ name: 'offset', options: { offset: [0, 25] } }],
  });

  export let hovering: boolean;
  export let transitioning: boolean;
</script>

<p
  tabindex="0"
  use:ref
  on:blur={() => (hovering = false)}
  on:focus={() => (hovering = true)}
  on:mouseleave={() => (hovering = false)}
  on:mouseenter={() => (hovering = true)}
  class="cursor-pointer focus:outline-none hover:text-primary focus:text-primary"
>
  You can always use <span class="font-bold text-primary">meetwhen.io</span> without logging in!
</p>
{#if hovering && !transitioning}
  <div use:content transition:fade|local={{ duration: 150 }} class="relative p-4 card">
    <h2 class="mb-2 font-bold text-center">Why log in?</h2>
    <ul>
      <li class="ml-4 list-disc list-outside">Keep track of all your meetings</li>
      <li class="ml-4 list-disc list-outside">Integrate third-party calendars</li>
    </ul>
  </div>
{/if}
