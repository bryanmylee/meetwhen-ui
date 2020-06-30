<script>
  import { fade, slide } from 'svelte/transition';

  import { TextInput } from 'src/components/form';

  // BINDINGS
  // ========
  export let username;
  export let password;

  // PROPS
  // =====
  export let prompt;
  export let attempted;
  export let tip = '';

  $: formValid = username.trim().length !== 0
      && password.trim().length !== 0;
</script>

<div
  class="card outline padded"
  class:error={attempted && !formValid}
  transition:slide={{duration: 400}}
>
  <!-- Content of div with slide transitions is not masked properly on
  Safari. Therefore, implement a nice fade in after div is fully sized. -->
  <div in:fade={{duration: 150, delay: 400}} out:fade={{duration: 150}}>
    <h3>{prompt}</h3>
    <TextInput label="Username" bind:value={username} required {attempted} />
    <TextInput label="Password" bind:value={password}
        isPassword required {attempted} {tip} />
  </div>
</div>

<style>
  h3 {
    color: var(--text-1);
    margin: 0;
    font-weight: 700;
  }
</style>