<script>
  import { flip } from 'svelte/animate';

  // BINDINGS
  // ========
  export let selectedUsernames;

  // PROPS
  // =====
  export let usernames;
</script>

<div class="card outline padded">
  <h3>Who's attending?</h3>
  <div class="names__container">
    {#each usernames as username (username)}
      <div animate:flip={{duration: 200}} class="name">
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

  .name {
    font-size: 0.8rem;
    margin: 0.5em;
    border: 1px var(--line-1) solid;
    border-radius: 500px;
    padding: 0.8em;
  }
</style>