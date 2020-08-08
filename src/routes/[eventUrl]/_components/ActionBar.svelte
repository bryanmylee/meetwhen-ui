<script>
  import { createEventDispatcher } from 'svelte';

  import { layoutEnum, layout, user } from 'src/stores';
  import { detailsEnum, formEnum, details, form } from '../stores';

  import { Button } from 'src/components/form';

  const dispatch = createEventDispatcher();

  // PROPS
  // =====
  export let disabled;
  export let fakeDisabled;

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
        <Button alt on:click={() => $details = detailsEnum.ATTENDANCE}>
          Filter
        </Button>
      {:else}
        <Button alt on:click={() => $details = detailsEnum.EVENT_DETAILS}>
          Details
        </Button>
      {/if}
    </div>
  {/if}

  <div class="bar__right">
    {#if $form !== formEnum.NONE}
      <Button alt on:click={resetForm}>
        Cancel
      </Button>
      <Button {disabled} {fakeDisabled} style={leftMarginStyle} on:click={submit}>
        Confirm
      </Button>
    {:else if $user.isLoggedIn}
      <Button on:click={logout}>
        Log Out
      </Button>
      <Button style={leftMarginStyle} on:click={() => $form = formEnum.EDITING}>
        Edit Schedule
      </Button>
    {:else}
      <Button on:click={() => $form = formEnum.LOGGING_IN}>
        Log In
      </Button>
      <Button style={leftMarginStyle} on:click={() => $form = formEnum.JOINING}>
        Sign Up
      </Button>
    {/if}
  </div>
</div>

<style>
  .bar {
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
  }
</style>