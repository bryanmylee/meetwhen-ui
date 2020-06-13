<script>
  import { flip } from 'svelte/animate';

  // BINDINGS
  // ========
  export let selectedUsernames = [];

  // PROPS
  // =====
  export let usernames;

  // STATE FUNCTIONS
  // ===============
  function toggleName(name) {
    if (selectedUsernames.includes(name)) {
      selectedUsernames = selectedUsernames.filter(n => n !== name);
    } else {
      selectedUsernames = [ ...selectedUsernames, name ];
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
        class:selected={selectedUsernames.includes(username)}
        animate:flip={{duration: 200}}
      >
        {username}
      </div>
    {/each}
  </div>
</div>

<style>
  h3 {
    color: var(--text-1);
    margin: 0;
    padding: 0 5px 5px;
    font-weight: 700;
  }

  .names__container {
    display: flex;
    flex-flow: row wrap;
  }

  .name-pill {
    font-size: 0.8rem;
    margin: 0.5em;
    border: 1px var(--line-1) solid;
    border-radius: 500px;
    padding: 0.8em;
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
</style>