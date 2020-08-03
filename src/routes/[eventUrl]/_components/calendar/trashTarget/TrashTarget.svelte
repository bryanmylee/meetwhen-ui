<script>
  import { fade } from 'svelte/transition';

  import Trash from 'src/components/icons/Trash.svelte';

  export let show = false;
</script>

{#if show}
  <div data-trash-target transition:fade={{ duration: 200 }}>
    <Trash/>
  </div>
{/if}

<style>
  div {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    bottom: 1.5em;
    z-index: 15;
    width: 3em;
    height: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.8em;
    border-radius: 500px;
    background-color: var(--bg);
    transition: all 200ms ease-in;
    box-shadow: var(--shadow-small);
    cursor: pointer;
  }

  div:hover {
    box-shadow: var(--shadow-large);
    background-color: var(--error-300);
  }

  :global([data-trash-target] svg path) {
    fill: var(--error-300);
  }

  :global([data-trash-target]:hover svg path) {
    fill: var(--bg);
  }
</style>