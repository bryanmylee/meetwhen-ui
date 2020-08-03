<script>
  import Share from 'src/components/icons/Share.svelte';
  import ShareModal from './ShareModal.svelte';

  let showModal;
</script>

<button on:click={() => showModal = true}>
  <Share color="var(--primary-text)" />
</button>
{#if showModal}
  <ShareModal on:dismiss={() => showModal = false}/>
{/if}

<style>
  button {
    width: 40px;
    height: 40px;
    padding: 0.5em;
    border-radius: 1.5em;
    background-color: transparent;
    border: none;
    outline: none;
    opacity: 80%;
    transition: all 200ms ease;
    cursor: pointer;
  }

  button:hover, button:focus {
    background-color: var(--primary-400);
  }

  button:active {
    background-color: var(--primary-600);
  }
</style>