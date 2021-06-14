<script lang="ts">
  import { MinimizeIcon, MaximizeIcon } from 'svelte-feather-icons';

  export let isFullscreen = false;
  let isFullscreenDelayed = isFullscreen;
  $: setTimeout(() => {
    isFullscreenDelayed = isFullscreen;
  }, 20);
</script>

<button
  type="button"
  on:click={() => (isFullscreen = !isFullscreen)}
  class="absolute w-10 h-10 rounded-full right-2 bottom-2 button shade"
>
  {#if isFullscreenDelayed}
    <MinimizeIcon class="p-2.5" />
  {:else}
    <MaximizeIcon class="p-2.5" />
  {/if}
</button>
