<script>
  import { layoutStates, detailsStates, formStates } from './_pageStates.js';

  import { Button } from '@/components/form';

  // BINDINGS
  // ========
  export let detailsState;
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
      {#if detailsState === detailsStates.EVENT_DETAILS}
        <Button on:click={() => detailsState = detailsStates.ATTENDANCE}>Who's attending?</Button>
      {:else if detailsState === detailsStates.ATTENDANCE}
        <Button on:click={() => detailsState = detailsStates.EVENT_DETAILS}>Event details</Button>
      {/if}
    </div>
  {/if}
  <div class="bar__right">
    {#if isLoggedIn}
      <Button>Edit selections</Button>
    {:else}
      {#if formState === formStates.LOGGING_IN}
        <Button on:click={() => formState = formStates.NONE}>Cancel</Button>
        <div class="margin-left">
          <Button on:click={handleSubmitLogin}>Confirm</Button>
        </div>
      {:else if formState === formStates.JOINING}
        <Button on:click={() => formState = formStates.NONE}>Cancel</Button>
        <div class="margin-left">
          <Button on:click={handleSubmitNewUser}>Confirm</Button>
        </div>
      {:else if formState === formStates.NONE}
        <Button on:click={() => formState = formStates.LOGGING_IN}>Login</Button>
        <div class="margin-left">
          <Button on:click={() => formState = formStates.JOINING}>Join Event</Button>
        </div>
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
  }

  .bar__left {
    margin-right: auto;
    padding-right: 0.5rem;
  }

  .bar__right {
    margin-left: auto;
    padding-left: 0.5rem;
  }

  .margin-left {
    margin-left: 1rem;
  }
</style>