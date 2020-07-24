<script>
  import { createEventDispatcher } from 'svelte';
  import { layoutEnum, layout } from 'src/stores';
  import { detailsEnum, formEnum, details, form } from '../stores';
  import { user } from 'src/stores';

  import { Button } from 'src/components/form';

  const dispatch = createEventDispatcher();

  // PROPS
  // =====
  const leftMarginStyle = 'margin-left: 1rem';

  function resetForm() {
    $form = formEnum.NONE;
  }

  function submit() {
    dispatch('submit');
  }

  function logout() {
    dispatch('logout');
  }
</script>

<div class="bar">
  {#if $layout === layoutEnum.NARROW}
    <div class="bar__left">
      {#if $details === detailsEnum.EVENT_DETAILS}
        <Button alt on:click={() => $details = detailsEnum.ATTENDANCE}>
          Filter Users
        </Button>
      {:else}
        <Button alt on:click={() => $details = detailsEnum.EVENT_DETAILS}>
          Event Details
        </Button>
      {/if}
    </div>
  {/if}

  <div class="bar__right">
    {#if $user.isLoggedIn}
      {#if $form === formEnum.EDITING}
        <Button outline on:click={resetForm}>
          Cancel
        </Button>
        <Button style={leftMarginStyle} on:click={submit}>
          Confirm
        </Button>
      {:else}
        <Button on:click={logout}>
          Log Out
        </Button>
        <Button style={leftMarginStyle} on:click={() => $form = formEnum.EDITING}>
          Edit Schedule
        </Button>
      {/if}
    {:else}
      {#if $form === formEnum.LOGGING_IN}
        <Button outline on:click={resetForm}>
          Cancel
        </Button>
        <Button style={leftMarginStyle} on:click={submit}>
          Confirm
        </Button>
      {:else if $form === formEnum.JOINING}
        <Button outline on:click={resetForm}>
          Cancel
        </Button>
        <Button style={leftMarginStyle} on:click={submit}>
          Confirm
        </Button>
      {:else}
        <Button on:click={() => $form = formEnum.LOGGING_IN}>
          Login
        </Button>
        <Button style={leftMarginStyle} on:click={() => $form = formEnum.JOINING}>
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