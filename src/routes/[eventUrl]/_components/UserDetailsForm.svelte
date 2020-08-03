<script>
  import { createEventDispatcher } from 'svelte';
  import { fade, slide } from 'svelte/transition';

  import { layout, layoutEnum } from 'src/stores';
  import { form, formEnum } from '../stores';
  import { validateNewPassword, validateNewUsername, validatePassword, validateUsername } from 'src/utils/validation';
  import { KEY_RETURN } from 'src/utils/constants';

  import CaretDown from 'src/components/icons/CaretDown.svelte';
  import { TextInput } from 'src/components/form';

  const dispatch = createEventDispatcher();

  // BINDINGS
  // ========
  export let username;
  export let password;
  export let formValid;

  // PROPS
  // =====
  export let attempted;
  export let collapsed = false;

  let firstTransition = true;
  $: if (collapsed) {
    firstTransition = false;
  }

  // STATE
  // =====
  let usernameValidation;
  let passwordValidation;
  let prompt = '';
  let tip = '';
  let usernameValid;
  let passwordValid;
  $: formValid = usernameValid && passwordValid;
  $: {
    if ($form === formEnum.LOGGING_IN) {
      usernameValidation = validateUsername;
      passwordValidation = validatePassword;
      prompt = 'Log in';
      tip = '';
    } else if ($form === formEnum.JOINING) {
      usernameValidation = validateNewUsername;
      passwordValidation = validateNewPassword;
      prompt = 'Create an account';
      tip = 'Account is unique to this event only';
    }
  }

  function handleKeydown(event) {
    if (event.keyCode === KEY_RETURN) {
      event.preventDefault();
      dispatch('submit');
    }
  }
</script>

<!-- Use double transition to hide overflowing content on slide transition with Safari -->
<!-- Setting overflow: hidden causes CSS grid layout to break on Firefox -->
<div
  class="card outline padded"
  class:error={attempted && !formValid}
  transition:slide={{ duration: 300 }}
>
  <div in:fade={{ duration: 150, delay: 300 }} out:fade={{ duration: 150 }}>
    <div class="form-header" on:click={() => collapsed = !collapsed} >
      <h3>{prompt}</h3>
      <CaretDown
        flipped={!collapsed || $layout === layoutEnum.WIDE}
        style="margin: -0.4em;"
      />
    </div>
    {#if !collapsed || $layout === layoutEnum.WIDE}
      <div
        in:slide={{ duration: firstTransition ? 0 : 300 }}
        out:slide={{ duration: 300 }}
        style="margin-top: 0.8em; overflow: hidden; padding-bottom: 2px;"
      >
        <TextInput label="Username"
          bind:value={username} bind:valid={usernameValid}
          on:keydown={handleKeydown}
          focusOnMount required {attempted} validationFunction={usernameValidation} />
        <TextInput label="Password"
          bind:value={password} bind:valid={passwordValid}
          on:keydown={handleKeydown}
          required isPassword {tip}
          {attempted} validationFunction={passwordValidation}
          style="margin-top: 0.8em" />
      </div>
    {/if}
  </div>
</div>

<style>
  div {
    height: min-content;
  }

  .form-header {
    /* Extend the form header to the edges of the card to allow a larger selection target */
    margin: -0.8em;
    padding: 0.8em;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
  }
</style>