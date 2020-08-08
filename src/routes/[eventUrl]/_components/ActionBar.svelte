<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { createPopperActions } from 'svelte-popperjs';

  import { layoutEnum, layout, user } from 'src/stores';
  import { detailsEnum, formEnum, details, form } from '../_stores';
  import { SHOW_SIGN_UP, HIDE_SIGN_UP } from '../_tooltipDelays';

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

  function resetForm() {
    $form = formEnum.NONE;
  }
  // eslint-disable-next-line no-unused-expressions
  $: $form, showHint = false;

  function submit() {
    dispatch('submit');
  }

  function logout() {
    dispatch('logout');
  }

  const popperOptions = { placement: 'bottom-start' };

  let showHint = false;
  onMount(() => {
    setTimeout(() => {
      showHint = true;
    }, SHOW_SIGN_UP);
  });

  $: if (showHint) {
    setTimeout(() => {
      showHint = false;
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
      <Button on:click={() => $form = formEnum.LOGGING_IN}>
        Log In
      </Button>
      <div use:popperRef>
        <Button style={leftMarginStyle} on:click={() => $form = formEnum.JOINING}>
          Sign Up
        </Button>
      </div>

      {#if showHint}
        <div in:fade={{ duration: 200 }}>
          <Tooltip use={popperContent} {popperOptions}>
            <div class="tooltip">
              <h5>
                Sign up to add your schedule!
              </h5>
              <TooltipDismiss on:click={() => showHint = false} />
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

  h5 {
    margin-right: 0.5em;
  }
</style>