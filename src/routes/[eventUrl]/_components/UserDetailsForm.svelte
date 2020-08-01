<script>
  import { createEventDispatcher } from 'svelte';
  import { fade, slide } from 'svelte/transition';

  import { formEnum, form } from '../stores';
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
    <h3>{prompt}</h3>
    <TextInput label="Username"
      bind:value={username} bind:valid={usernameValid}
      on:keydown={handleKeydown}
      required {attempted} validationFunction={usernameValidation}
      style="margin-top: 1em" />
    <TextInput label="Password"
      bind:value={password} bind:valid={passwordValid}
      on:keydown={handleKeydown}
      required isPassword {tip}
      {attempted} validationFunction={passwordValidation}
      style="margin-top: 1em" />
  </div>
</div>