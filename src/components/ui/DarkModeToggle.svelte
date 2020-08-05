<script>
  import { fade } from 'svelte/transition';

  import { isDarkMode } from 'src/stores';

  import SunMoon from 'src/components/icons/SunMoon.svelte';

  export let forceWhite;
</script>

<div class="container" on:click={() => $isDarkMode = !$isDarkMode}>
  <div class="button" transition:fade={{ duration: 200 }}>
    <SunMoon color={forceWhite ? 'white' : 'var(--text-900)'} />
  </div>
</div>

<style>
  .container {
    position: relative;
    width: 32px;
    height: 32px;
  }

  .button {
    position: absolute;
    left: 0;
    top: 0;
    width: 32px;
    height: 32px;
    padding: 4px;
    border-radius: 500px;
    transition: background-color 200ms ease;
    cursor: pointer;
  }

  .button:hover, .button:focus {
    background-color: var(--grey-100);
  }

  .button:active {
    background-color: var(--grey-400);
  }
</style>