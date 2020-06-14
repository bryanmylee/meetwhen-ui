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
  export let tip;
  export let attempted;

  $: formValid = username.trim().length !== 0
      && password.trim().length !== 0;
</script>

<div
  class="card outline padded"
  class:error={attempted && !formValid}
  transition:slide={{duration: 300}}
>
  <!-- Content of div with slide transitions is not masked properly on
  Safari. Therefore, implement a nice fade in after div is fully sized. -->
  <div in:fade={{duration: 150, delay: 300}} out:fade={{duration: 150}}>
    <h3>{prompt}</h3>
    <TextInput label="Username" bind:value={username} required {attempted} />
    <TextInput label="Password" bind:value={password}
        isPassword required {attempted} />
    {#if tip}
      <h5>{tip}</h5>
    {/if}
  </div>
</div>

<style>
  h3 {
    color: var(--text-1);
    margin: 0;
    padding: 0 5px 5px;
    font-weight: 700;
  }

  h5 {
    color: var(--text-3);
    padding-left: 5px;
    margin: 0;
    font-size: 0.8em;
    font-style: italic;
    font-weight: 400;
  }
</style>