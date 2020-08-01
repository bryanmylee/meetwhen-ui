<script>
  import { createEventDispatcher } from 'svelte';

  import { layoutEnum, layout, user } from 'src/stores';
  import { detailsEnum, formEnum, details, form } from '../stores';

  import { Button } from 'src/components/form';

  const dispatch = createEventDispatcher();

  // PROPS
  // =====
  export let disabled;

  const leftMarginStyle = 'margin-left: 1em';

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
        <Button alt {disabled} on:click={() => $details = detailsEnum.ATTENDANCE}>
          Filter
        </Button>
      {:else}
        <Button alt {disabled} on:click={() => $details = detailsEnum.EVENT_DETAILS}>
          Details
        </Button>
      {/if}
    </div>
  {/if}

  <div class="bar__right">
    {#if $user.isLoggedIn}
      {#if $form === formEnum.EDITING}
        <Button alt {disabled} on:click={resetForm}>
          Cancel
        </Button>
        <Button {disabled} style={leftMarginStyle} on:click={submit}>
          Confirm
        </Button>
      {:else}
        <Button {disabled} on:click={logout}>
          Log Out
        </Button>
        <Button {disabled} style={leftMarginStyle} on:click={() => $form = formEnum.EDITING}>
          Edit Schedule
        </Button>
      {/if}
    {:else}
      {#if $form === formEnum.LOGGING_IN}
        <Button alt {disabled} on:click={resetForm}>
          Cancel
        </Button>
        <Button {disabled} style={leftMarginStyle} on:click={submit}>
          Confirm
        </Button>
      {:else if $form === formEnum.JOINING}
        <Button alt {disabled} on:click={resetForm}>
          Cancel
        </Button>
        <Button {disabled} style={leftMarginStyle} on:click={submit}>
          Confirm
        </Button>
      {:else}
        <Button {disabled} on:click={() => $form = formEnum.LOGGING_IN}>
          Login
        </Button>
        <Button {disabled} style={leftMarginStyle} on:click={() => $form = formEnum.JOINING}>
          Join Event
        </Button>
      {/if}
    {/if}
  </div>
</div>

<style>
  .bar {
    position: fixed;
    left: 0.5em;
    right: 0.5em;
    bottom: 0.5em;
    z-index: 30;
    display: flex;
  }

  .bar__left,
  .bar__right {
    display: flex;
  }

  .bar__left {
    margin-right: auto;
    padding-right: 0.5em;
  }

  .bar__right {
    margin-left: auto;
    padding-left: 0.5em;
  }

  @media screen and (min-width: 768px) {
    .bar {
      position: unset;
    }
  }
</style>