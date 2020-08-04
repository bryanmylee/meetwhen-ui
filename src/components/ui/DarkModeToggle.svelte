<script>
  import { fade } from 'svelte/transition';

  import { isDarkMode } from 'src/stores';

  import Sun from 'src/components/icons/Sun.svelte';
  import Moon from 'src/components/icons/Moon.svelte';

  $: icon = $isDarkMode ? Moon : Sun;
</script>

<div class="container" on:click={() => $isDarkMode = !$isDarkMode}>
  {#if $isDarkMode}
    <div class="button" transition:fade={{ duration: 200 }}>
      <Moon color="var(--text-700)" />
    </div>
  {:else}
    <div class="button" transition:fade={{ duration: 200 }}>
      <Sun color="var(--text-700)" />
    </div>
  {/if}
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