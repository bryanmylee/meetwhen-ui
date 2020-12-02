<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { createPopperActions } from 'svelte-popperjs';

  import { layoutEnum, layout, user } from 'src/stores';
  import { detailsEnum, formEnum, details, form } from '../_stores';

  import { Button } from 'src/components/form';
  import Tooltip from 'src/components/ui/Tooltip.svelte';
  import TooltipDismiss from 'src/components/ui/TooltipDismiss.svelte';

  const dispatch = createEventDispatcher();
  const [popperRef, popperContent] = createPopperActions();

  // PROPS
  // =====
  export let disabled;
  export let fakeDisabled;

  const leftMarginStyle = 'margin-left: 1em';
  const rightMarginStyle = 'margin-right: 1em';
  const SHOW_SIGN_UP = 500;
  const HIDE_SIGN_UP = 10000;

  function resetForm() {
    $form = formEnum.NONE;
  }

  function submit() {
    dispatch('submit');
  }

  function logout() {
    dispatch('logout');
  }

  const popperOptions = { placement: 'bottom-start' };

  let showSignupHint = false;
  // eslint-disable-next-line no-unused-expressions
  $: $form, showSignupHint = false;

  onMount(() => {
    setTimeout(() => {
      showSignupHint = true;
    }, SHOW_SIGN_UP);
  });

  $: if (showSignupHint) {
    setTimeout(() => {
      showSignupHint = false;
    }, HIDE_SIGN_UP);
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
      <Button style={rightMarginStyle} on:click={() => $form = formEnum.LOGGING_IN}>
        Edit Schedule
      </Button>
      or
      <div use:popperRef>
        <Button style={leftMarginStyle} on:click={() => $form = formEnum.JOINING}>
          Add Schedule
        </Button>
      </div>

      {#if showSignupHint}
        <div in:fade={{ duration: 200 }}>
          <Tooltip use={popperContent} {popperOptions}>
            <div class="tooltip">
              <h4>
                Get started by adding your schedule!
              </h4>
              <TooltipDismiss on:click={() => showSignupHint = false} />
            </div>
          </Tooltip>
        </div>
      {/if}
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
    align-items: center;
  }

  .bar__left {
    margin-right: auto;
    padding-right: 0.5em;
  }

  .bar__right {
    margin-left: auto;
    padding-left: 0.5em;
  }

  .tooltip {
    margin: 0.5em;
    display: flex;
    align-items: center;
  }

  h4 {
    margin-right: 0.5em;
  }
</style>
