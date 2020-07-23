<script>
  import { TextInput } from 'src/components/form';
  import { validateNewUsername, validateNewPassword } from 'src/utils/validation';

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
  let usernameValid;
  let passwordValid;
  $: formValid = usernameValid && passwordValid;
</script>

<div
  class="card outline padded"
  class:error={attempted && !formValid}
>
  <h3>Who are you?</h3>
  <TextInput label="Username" bind:value={username} bind:valid={usernameValid}
    required {attempted} validationFunction={validateNewUsername}
    style="margin-top: 1rem" />
  <TextInput label="Password" bind:value={password} bind:valid={passwordValid}
    required {attempted} validationFunction={validateNewPassword}
    isPassword tip="Account is unique to this event only"
    style="margin-top: 1rem" />
</div>