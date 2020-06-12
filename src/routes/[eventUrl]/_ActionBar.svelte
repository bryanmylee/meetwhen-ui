<script>
  import { layoutStates, titleStates, formStates } from './_pageStates.js';

  import { Button } from '@/components/form';

  // BINDINGS
  // ========
  export let titleState;
  export let formState;

  // PROPS
  // =====
  export let layoutState;
  export let isLoggedIn;
  export let handleSubmitLogin;
  export let handleSubmitNewUser;
</script>

<div class="bar">
  {#if layoutState === layoutStates.NARROW}
    <div class="bar__left">
      {#if titleState === titleStates.EVENT_DETAILS}
        <Button on:click={() => titleState = titleStates.WHOS_ATTENDING}>Who's attending?</Button>
      {:else if titleState === titleStates.WHOS_ATTENDING}
        <Button on:click={() => titleState = titleStates.EVENT_DETAILS}>Event details</Button>
      {/if}
    </div>
  {/if}
  <div class="bar__right">
    {#if isLoggedIn}
      <Button>Edit selections</Button>
    {:else}
      {#if formState === formStates.LOGGING_IN}
        <Button on:click={() => formState = formStates.NONE}>Cancel</Button>
        <Button on:click={handleSubmitLogin}>Confirm</Button>
      {:else if formState === formStates.JOINING}
        <Button on:click={() => formState = formStates.NONE}>Cancel</Button>
        <Button on:click={handleSubmitNewUser}>Confirm</Button>
      {:else if formState === formStates.NONE}
        <Button on:click={() => formState = formStates.LOGGING_IN}>Login</Button>
        <Button on:click={() => formState = formStates.JOINING}>Join Event</Button>
      {/if}
    {/if}
  </div>
</div>

<style>
  .bar {
    justify-self: end;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .bar__left,
  .bar__right {
    display: flex;
    gap: 1rem;
  }

  .bar__left {
    margin-right: auto;
  }

  .bar__right {
    margin-left: auto;
  }
</style>