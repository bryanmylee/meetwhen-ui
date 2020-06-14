<script>
  import { slide } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  import { selectedUsernames } from '../stores.js';

  // BINDINGS
  // ========

  // PROPS
  // =====
  export let usernames;

  // STATE FUNCTIONS
  // ===============
  function toggleName(name) {
    if ($selectedUsernames.includes(name)) {
      $selectedUsernames = $selectedUsernames.filter(n => n !== name);
    } else {
      $selectedUsernames = [ ...$selectedUsernames, name ];
    }
  }
</script>

<div class="card outline padded">
  <h3>Who's attending?</h3>
  <div class="names__container">
    {#each usernames as username (username)}
      <div
        on:click={() => toggleName(username)}
        class="name-pill"
        class:selected={$selectedUsernames.includes(username)}
        animate:flip={{duration: 200}}
      >
        {username}
      </div>
    {/each}
  </div>
  <h5>Select a username to see their schedule</h5>
</div>

<style>
  h3 {
    margin: 0;
    color: var(--text-1);
    font-weight: 700;
  }

  .names__container {
    font-size: 0.8rem;
    margin-top: 0.3rem;
    display: flex;
    flex-flow: row wrap;
  }

  .name-pill {
    margin: 0.5em 0.5em 0 0;
    border: 1px var(--line-1) solid;
    border-radius: 1.5em;
    min-width: 3em;
    padding: 0.5em;
    text-align: center;
    color: var(--text-0);
    background-color: white;
    transition: all 200ms ease;
  }

  .name-pill:hover {
    color: var(--text-3);
  }

  .name-pill:active {
    transform: scale(0.98);
  }

  .name-pill.selected {
    color: white;
    background-color: var(--primary-1);
  }

  h5 {
    color: var(--text-3);
    margin: 0.5rem 0 0;
    font-size: 0.8rem;
    font-style: italic;
    font-weight: 400;
  }
</style>