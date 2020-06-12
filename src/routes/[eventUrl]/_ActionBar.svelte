<script>
  import { NONE, LOGGING_IN, JOINING } from './_pageStates.js';

  import { Button } from '@/components/form';

  // BINDINGS
  // ========
  export let pageState;

  // PROPS
  // =====
  export let isLoggedIn;
  export let handleSubmitLogin;
  export let handleSubmitNewUser;
</script>

<div class="bar">
  <!-- BUTTONS -->
  {#if isLoggedIn}
    <Button>Edit selections</Button>
  {:else}
    {#if pageState === LOGGING_IN}
      <div class="button__container">
        <Button on:click={() => pageState = NONE}>Cancel</Button>
      </div>
      <div class="button__container">
        <Button on:click={handleSubmitLogin}>Confirm</Button>
      </div>
    {:else if pageState === JOINING}
      <div class="button__container">
        <Button on:click={() => pageState = NONE}>Cancel</Button>
      </div>
      <div class="button__container">
        <Button on:click={handleSubmitNewUser}>Confirm</Button>
      </div>
    {:else if pageState === NONE}
      <div class="button__container">
        <Button on:click={() => pageState = LOGGING_IN}>Login</Button>
      </div>
      <div class="button__container">
        <Button on:click={() => pageState = JOINING}>Join Event</Button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .bar {
    display: flex;
    align-items: center;
    justify-self: end;
  }

  .button__container {
    min-width: -moz-max-content;
    min-width: -webkit-max-content;
    margin-left: 1rem;
  }
</style>