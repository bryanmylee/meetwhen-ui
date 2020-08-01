<script>
  import { createEventDispatcher } from 'svelte';
  import { fade, slide } from 'svelte/transition';

  import { layout, layoutEnum } from 'src/stores';
  import { form, formEnum } from '../stores';
  import { validateNewPassword, validateNewUsername, validatePassword, validateUsername } from 'src/utils/validation';
  import { KEY_RETURN } from 'src/utils/constants';

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

<div
  class="card outline padded"
  class:error={attempted && !formValid}
  transition:slide={{ duration: 400 }}
>
  <!-- Content of div with slide transitions is not masked properly on
  Safari. Therefore, implement a nice fade in after div is fully sized. -->
  <div in:fade={{ duration: 150, delay: 400 }} out:fade={{ duration: 150 }}>
    <h3 on:click={() => collapsed = !collapsed} >{prompt}</h3>
    {#if !collapsed || $layout === layoutEnum.WIDE}
      <div
        in:slide={{ duration: firstTransition ? 0 : 400 }}
        out:slide={{ duration: 400 }}
        style="margin-top: 1em"
      >

      <TextInput label="Username"
        bind:value={username} bind:valid={usernameValid}
        on:keydown={handleKeydown}
        required {attempted} validationFunction={usernameValidation} />
      <TextInput label="Password"
        bind:value={password} bind:valid={passwordValid}
        on:keydown={handleKeydown}
        required isPassword {tip}
        {attempted} validationFunction={passwordValidation}
        style="margin-top: 1em" />

      </div>
    {/if}
  </div>
</div>