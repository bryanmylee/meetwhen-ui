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

  const leftMarginStyle = 'margin-left: 1rem'
</script>

<div class="bar">
  {#if $layout === layoutEnum.NARROW}
    <div class="bar__left">
      {#if $details === detailsEnum.EVENT_DETAILS}
        <Button alt on:click={_ => $details = detailsEnum.ATTENDANCE}>
          Who's attending?
        </Button>
      {:else}
        <Button alt on:click={_ => $details = detailsEnum.EVENT_DETAILS}>
          Event details
        </Button>
      {/if}
    </div>
  {/if}

  <div class="bar__right">
    {#if $user.isLoggedIn}
      {#if $form === formEnum.EDITING}
        <Button outline on:click={_ => $form = formEnum.NONE}>
          Cancel
        </Button>
        <AwaitButton style={leftMarginStyle} onClick={handleSubmitEditUser}>
          Confirm
        </AwaitButton>
      {:else}
        <AwaitButton onClick={handleLogout}>
          Log Out
        </AwaitButton>
        <Button style={leftMarginStyle} on:click={_ => $form = formEnum.EDITING}>
          Edit
        </Button>
      {/if}
    {:else}
      {#if $form === formEnum.LOGGING_IN}
        <Button outline on:click={_ => $form = formEnum.NONE}>
          Cancel
        </Button>
        <AwaitButton style={leftMarginStyle} onClick={handleSubmitLogin}>
          Confirm
        </AwaitButton>
      {:else if $form === formEnum.JOINING}
        <Button outline on:click={_ => $form = formEnum.NONE}>
          Cancel
        </Button>
        <AwaitButton style={leftMarginStyle} onClick={handleSubmitNewUser}>
          Confirm
        </AwaitButton>
      {:else}
        <Button on:click={_ => $form = formEnum.LOGGING_IN}>
          Login
        </Button>
        <Button style={leftMarginStyle} on:click={_ => $form = formEnum.JOINING}>
          Join Event
        </Button>
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

  @media screen and (min-width: 768px) {
    .bar {
      position: unset;
    }
  }
</style>