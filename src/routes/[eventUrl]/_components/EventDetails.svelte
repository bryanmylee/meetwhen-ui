<script>
  import { slide } from 'svelte/transition';

  import { user } from 'src/stores';

  import ShareButton from './shareModal/ShareButton.svelte';

  // PROPS
  // =====
  export let title;
  export let description;
</script>

<div class="card outline padded">
  <div class="header">
    <h1>{title}</h1>
    <ShareButton />
  </div>
  {#if description}
    <p>{description}</p>
  {/if}
  {#if $user.isLoggedIn}
    <h5 class="tip" transition:slide={{ duration: 200 }}>
      Logged in as <strong>{$user.username}</strong>
    </h5>
  {/if}
</div>

<style>
  .card {
    background: var(--primary-700);
    background: linear-gradient(90deg, var(--primary-500) 0%, var(--primary-gradient-dark) 100%);
    border: none;
    color: var(--primary-text);
    transition: background-color 200ms ease-out;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h1, p, h5 {
    color: var(--primary-text);
  }

  h1 {
    margin: 0;
  }

  p {
    margin: 0.5em 0 0;
  }
</style>