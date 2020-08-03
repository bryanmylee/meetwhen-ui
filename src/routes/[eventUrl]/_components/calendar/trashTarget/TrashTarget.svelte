<script>
  import { fade } from 'svelte/transition';

  import Trash from 'src/components/icons/Trash.svelte';

  export let show = false;
</script>

{#if show}
  <div data-trash-target transition:fade={{ duration: 200 }}>
    <Trash color="var(--error-300)" />
  </div>
{/if}

<style>
  div {
    position: sticky;
    left: 50%;
    transform: translate(-50%, 0);
    bottom: 1em;
    z-index: 15;
    width: 3em;
    height: 3em;
    border-radius: 500px;
    padding: 0.8em;
    background-color: var(--bg);
    transition: all 200ms ease-in;
    box-shadow: var(--shadow-small);
  }

  div:hover {
    box-shadow: var(--shadow-med);
  }
</style>