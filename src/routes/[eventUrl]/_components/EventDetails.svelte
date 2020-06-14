<script>
  import { slide } from 'svelte/transition';

  import { user } from 'src/stores.js';

  // PROPS
  // =====
  export let title;
  export let description;
</script>

<div class="card outline padded">
  <h1>{title}</h1>
  {#if description}
    <p>{description}</p>
  {/if}
  {#if $user.isLoggedIn}
    <h5 transition:slide={{duration: 200}}>
      Logged in as <strong>{$user.username}</strong>
    </h5>
  {/if}
</div>

<style>
  h1 {
    margin: 0;
  }

  p {
    margin: 0.5em 0 0;
  }

  h5 {
    color: var(--text-3);
    margin: 0.5rem 0 0;
    font-size: 0.8rem;
    font-style: italic;
    font-weight: 400;
  }
</style>