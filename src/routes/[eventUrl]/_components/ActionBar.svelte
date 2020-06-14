<script>
  import {
    layoutEnum, detailsEnum, formEnum,
    layout, details, form,
  } from '../stores.js';
  import { user } from 'src/stores.js';

  import { Button } from 'src/components/form';

  // PROPS
  // =====
  export let handleSubmitLogin;
  export let handleLogout;
  export let handleSubmitNewUser;
</script>

<div class="bar">
  {#if $layout === layoutEnum.NARROW}
    <div class="bar__left">
      {#if $details === detailsEnum.EVENT_DETAILS}
        <Button alt on:click={() => $details = detailsEnum.ATTENDANCE}>Who's attending?</Button>
      {:else if $details === detailsEnum.ATTENDANCE}
        <Button alt on:click={() => $details = detailsEnum.EVENT_DETAILS}>Event details</Button>
      {/if}
    </div>
  {/if}
  <div class="bar__right">
    {#if $user.isLoggedIn}
      <Button on:click={handleLogout}>Log Out</Button>
      <div class="margin-left">
        <Button>Edit selections</Button>
      </div>
    {:else}
      {#if $form === formEnum.LOGGING_IN}
        <Button outline on:click={() => $form = formEnum.NONE}>Cancel</Button>
        <div class="margin-left">
          <Button on:click={handleSubmitLogin}>Confirm</Button>
        </div>
      {:else if $form === formEnum.JOINING}
        <Button outline on:click={() => $form = formEnum.NONE}>Cancel</Button>
        <div class="margin-left">
          <Button on:click={handleSubmitNewUser}>Confirm</Button>
        </div>
      {:else if $form === formEnum.NONE}
        <Button on:click={() => $form = formEnum.LOGGING_IN}>Login</Button>
        <div class="margin-left">
          <Button on:click={() => $form = formEnum.JOINING}>Join Event</Button>
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