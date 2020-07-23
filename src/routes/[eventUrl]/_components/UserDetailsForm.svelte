<script>
  import { fade, slide } from 'svelte/transition';
  import { TextInput } from 'src/components/form';

  // BINDINGS
  // ========
  export let username;
  export let password;
  export let formValid;

  // PROPS
  // =====
  export let usernameValidation;
  export let passwordValidation;
  export let prompt;
  export let attempted;
  export let tip = '';

  // STATE
  // =====
  let usernameValid;
  let passwordValid;
  $: formValid = usernameValid && passwordValid;
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
    <TextInput label="Username" bind:value={username} bind:valid={usernameValid}
      required {attempted} validationFunction={usernameValidation}
      style="margin-top: 1rem" />
    <TextInput label="Password" bind:value={password} bind:valid={passwordValid}
      required isPassword {tip}
      {attempted} validationFunction={passwordValidation}
      style="margin-top: 1rem" />
  </div>
</div>