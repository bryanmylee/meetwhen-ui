<script>
  import { selectedUsernames } from '../../stores';
  import { flip } from 'svelte/animate';

  // PROPS
  // =====
  export let usernames;

  // STATE FUNCTIONS
  // ===============
  function toggleName(name) {
    if ($selectedUsernames.includes(name)) {
      $selectedUsernames = $selectedUsernames.filter((n) => n !== name);
    } else {
      $selectedUsernames = [...$selectedUsernames, name];
    }
  }
</script>

<div class="container">
  {#each usernames as username (username)}
    <div
      on:click={() => toggleName(username)}
      class="name-pill"
      class:selected={$selectedUsernames.includes(username)}
      animate:flip={{ duration: 200 }}
    >
      {username}
    </div>
  {/each}
</div>

<style>
  .container {
    font-size: 0.8rem;
    margin-bottom: 0.8rem;
    display: flex;
    flex-flow: row wrap;
  }

  .name-pill {
    margin: 0.6em 0.5em 0 0;
    border: 1px solid transparent;
    border-radius: 1.5em;
    min-width: 3em;
    padding: 0.5em;
    text-align: center;
    color: var(--text-800);
    background-color: var(--grey-100);
    transition: all 200ms ease;
    cursor: pointer;
  }

  .name-pill:hover {
    box-shadow: var(--shadow-small);
  }

  .name-pill:active {
    transform: scale(0.98);
    box-shadow: none;
  }

  .name-pill.selected {
    color: var(--primary-text);
    background-color: var(--primary-500);
    border-color: transparent;
  }
</style>