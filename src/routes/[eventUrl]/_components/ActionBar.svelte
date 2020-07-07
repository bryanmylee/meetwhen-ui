<script>
  import { layoutEnum, layout } from 'src/stores.js';
  import { detailsEnum, formEnum, details, form, } from '../stores.js';
  import { user } from 'src/stores.js';

  import { AwaitButton, Button } from 'src/components/form';

  // PROPS
  // =====
  export let handleSubmitLogin;
  export let handleLogout;
  export let handleSubmitNewUser;
  export let handleSubmitEditUser;
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
      {#if $form === formEnum.EDITING}
        <Button outline on:click={() => $form = formEnum.NONE}>Cancel</Button>
        <div class="margin-left">
          <AwaitButton onClick={handleSubmitEditUser}>Confirm</AwaitButton>
        </div>
      {:else}
        <AwaitButton onClick={handleLogout}>Log Out</AwaitButton>
        <div class="margin-left">
          <Button on:click={() => $form = formEnum.EDITING}>Edit</Button>
        </div>
      {/if}
    {:else}
      {#if $form === formEnum.LOGGING_IN}
        <Button outline on:click={() => $form = formEnum.NONE}>Cancel</Button>
        <div class="margin-left">
          <AwaitButton onClick={handleSubmitLogin}>Confirm</AwaitButton>
        </div>
      {:else if $form === formEnum.JOINING}
        <Button outline on:click={() => $form = formEnum.NONE}>Cancel</Button>
        <div class="margin-left">
          <AwaitButton onClick={handleSubmitNewUser}>Confirm</AwaitButton>
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
    position: fixed;
    left: 0.5rem;
    right: 0.5rem;
    bottom: 0.5rem;
    z-index: 30;
    display: flex;
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
    display: flex;
  }

  @media screen and (min-width: 768px) {
    .bar {
      position: unset;
    }
  }
</style>