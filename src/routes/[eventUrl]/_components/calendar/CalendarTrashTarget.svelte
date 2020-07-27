<script>
  import { fade } from 'svelte/transition';

  import TrashIcon from './TrashIcon.svelte';

  export let show = false;
</script>

{#if show}
  <div class="calendar--trash-target" transition:fade={{ duration: 200 }}>
    <TrashIcon />
  </div>
{/if}

<style>
  div {
    position: sticky;
    left: 50%;
    bottom: 1rem;
    z-index: 15;
    width: 3rem;
    height: 3rem;
    border-radius: 500px;
    padding: 0.8em;
    background-color: var(--error-50);
    box-shadow: var(--shadow-med);
    transition: all 200ms ease-in;
  }

  div:hover {
    background-color: white;
    box-shadow: var(--shadow-large);
  }
</style>